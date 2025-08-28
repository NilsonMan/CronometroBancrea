import * as ort from "onnxruntime-web";
import onnxModel from "./Face_detection.onnx";

// Cargar el modelo
const sess = await ort.InferenceSession.create(onnxModel);

/**
 * Función que recibe un arreglo, el cual representa a una imagen, para detectar las coordenadas en las que se encuentra un rostro
 * @param {*} imgArray
 * @returns
 */
export const handleFaceDetection = async (imgArray, height, width) => {
  try {
    const array = new Float32Array(imgArray);

    const input = new ort.Tensor("float32", array, [1, height, width, 3]);

    const outputMap = await sess.run(
      { x: input },
      { graphOptimizationLevel: "all" }
    );

    const outputTensor = outputMap.tf_op_layer_GatherV2_2;

    return outputTensor;
  } catch (error) {
    console.error("Error during model inference:", error);
    console.error("Error loading ONNX model:", error.message);
    console.error("Stack trace:", error.stack);
    // Aquí puedes manejar el error de manera más detallada o lanzar una excepción
    throw error;
  }
};

export function resizeBase64Img(base64, newWidth, newHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Establecer el nuevo tamaño del canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Dibujar la imagen redimensionada en el canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Obtener el nuevo base64 de la imagen redimensionada
      const newBase64 = canvas.toDataURL("image/jpeg");
      resolve(newBase64);
    };
  });
}

export function cropBase64Img(base64, x1, y1, x2, y2) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    
      const leeway=.2
      // Calcular el ancho y el alto del recorte
      const cropWidth = x2 - x1;
      const cropHeight = y2 - y1;

      // Establecer el tamaño del canvas al tamaño del recorte
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Dibujar la imagen recortada en el canvas
      ctx.drawImage(
        img,
        x1-cropWidth*leeway,
        y1-cropHeight*leeway,
        cropWidth*(1+leeway),
        cropHeight*(1+leeway),
        0,
        0,
        cropWidth*(1+leeway),
        cropHeight*(1+leeway)
      );

      // Obtener el nuevo base64 de la imagen recortada
      const croppedBase64 = canvas.toDataURL("image/jpeg");
      resolve(croppedBase64);
    };
  });
}

export async function base64ToPixelArray(base64) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Establecer el tamaño del canvas al tamaño de la imagen
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0);

      // Obtener los datos de los píxeles
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Convertir los datos en un arreglo de píxeles (tensor)
      const pixelArray = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255; // Rojo
        const g = data[i + 1] / 255; // Verde
        const b = data[i + 2] / 255; // Azul
        // const a = data[i + 3]; // Alfa
        // pixelArray.push([r, g, b]); // Empujar el píxel [R, G, B, A] al arreglo

        pixelArray.push(r);
        pixelArray.push(g);
        pixelArray.push(b);
      }

      resolve(pixelArray);
    };
  });
}

export const fileToBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });

export const convertImageToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const base64 = await fileToBase64(blob);
  return base64;
};
