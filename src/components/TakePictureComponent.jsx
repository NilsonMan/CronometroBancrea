import { useEffect, useState } from "react";
import {
  base64ToPixelArray,
  cropBase64Img,
  handleFaceDetection,
  resizeBase64Img,
} from "../utils/ia-functions";
import { sendMessage } from "../utils/WebsocketIA";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
const height = 240;
const width = 320;

const TakePictureComponent = ({
  webcamRef,
  startRecording = () => {},
  socket,
  finish = false
}) => {
  const [currentInterval, setCurrentInterval] = useState(null);
  const { messageIA } = useSelector((store) => store);

  const handleTakePicuture = async () => {
    let currentSocket = socket;
    // if (currentSocket?.readyState !== WebSocket.OPEN) {
    //   currentSocket = connectWebSocket();
    //   setSocket(currentSocket);
    // }
    if (webcamRef.current) {
      // Obtener imagen original
      const i1 = performance.now();
      const jpegBase64 = await webcamRef.current.getScreenshot({
        format: "image/jpeg",
      });
      const i2 = performance.now();
      // console.log("jpegBase64", i2 - i1);

      // const jpegBase64 = await convertImageToBase64(TestIMG);

      // Redimensionar imagen
      const r1 = performance.now();
      const resizedBase64 = await resizeBase64Img(jpegBase64, width, height);
      const r2 = performance.now();
      // console.log("resizedBase64", r2 - r1);
      // Convertir a arreglo
      const a1 = performance.now();
      const pixelArray = await base64ToPixelArray(resizedBase64);
      const a2 = performance.now();

      // console.log("base64ToPixelArray", a2 - a1);

      // Obtener caras
      const p1 = performance.now();
      const tensor = await handleFaceDetection(pixelArray, height, width);
      const p2 = performance.now();

      // console.log("handleFaceDetection", p2 - p1);

      if (tensor?.cpuData instanceof Float32Array) {
        function splitArrayByDims(array, dims) {
          const [numChunks, chunkSize] = dims;
          const results = [];

          for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            results.push(array.slice(start, end));
          }

          return results;
        }

        let results = splitArrayByDims(tensor?.cpuData, tensor?.dims);

        if (results.length > 0) {
          for (let result of results) {
            const [
              probabilidadDeNoSerRostro,
              probabilidadDeSerRostro,

              coordXTopLeft,
              coordYTopLeft,

              coordXBottomRight,
              coordYBottomRight,
            ] = result;

            // TODO: SE MULTIPLICAN POR QUE NUMERO PARA PASARLO DE PURO DECIMAL A COORDENADA BIEN
            // Recortar imagen
            const x1 = coordXTopLeft * width,
              y1 = coordYTopLeft * height,
              x2 = coordXBottomRight * width,
              y2 = coordYBottomRight * height; // Coordenadas del recorte

            const croppedBase64 = await cropBase64Img(
              resizedBase64,
              x1,
              y1,
              x2,
              y2
            );

            const resizedCroppedBase64 = await resizeBase64Img(
              croppedBase64,
              256,
              256
            );

            sendMessage(currentSocket, {
              request_id: "87b7cb79481f317bde90c116cf36084b",
              img: resizedCroppedBase64.replace("data:image/jpeg;base64,", ""),
            });

            const imgCropped = document.getElementById("imgCropped");
            imgCropped.src = croppedBase64;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN && !finish) {
      const timesPerSecond = 3;

      const intervalId = setInterval(handleTakePicuture, 1000 / timesPerSecond);
      setCurrentInterval(intervalId);
    } else {
      clearInterval(currentInterval);
    }

    return () => {
      clearInterval(currentInterval);
    };
  }, [socket?.readyState, finish]);

  // useEffect(() => {
  //   if (messageIA.isValid) {
      // startRecording();
  //   }
  // }, [messageIA.message]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <Webcam
          style={{
            objectFit: "cover",
          }}
          className="w-full h-full"
          audio={false}
          ref={webcamRef}
          mirrored
          screenshotFormat="image/jpeg"
          minScreenshotHeight={720}
          minScreenshotWidth={1280}
          screenshotQuality={1}
        />

        <img id="imgCropped" />
      </div>
      {/* <button onClick={handleTakePicuture}>Procesar imagen</button> */}

      {/* <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Original</h2>
          <img id="imgOriginal" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Copia</h2>
          <img
            id="imgResized"
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </div>
      </div> */}

      <h3>{messageIA.message}</h3>
    </div>
  );
};

export default TakePictureComponent;
