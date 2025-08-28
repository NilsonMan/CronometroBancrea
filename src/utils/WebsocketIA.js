import { redux_setMessageIA } from "../redux/messageIA";
import { store } from "../redux/store";

// Función para abrir la conexión WebSocket
export function connectWebSocket() {
  let socket = new WebSocket(
    "ws://172.26.0.123:8000/ws/img/inference?token=9caacf96f0a44e575be59d37f564559c"
  );

  socket.addEventListener("open", function (event) {
    console.warn("WebSocket CONECTADO");
  });

  // Event listener para recibir mensajes
  socket.addEventListener("message", function (event) {
    console.warn("Mensaje del Websocket:", event.data);

    try {
      const response = JSON.parse(event.data);
      if (response?.predictions) {
        // Para aprobar la imagen debe ser
        // glasses: true // no tiene lentes
        // lighting: true // iluminación
        // occlusion: true. // obstruction
        // hat: true // no tiene sombrero
        // Pose: true // no está posando
        const { glasses, lighting, occlusion, hat, pose } =
          response?.predictions;
        if (!glasses) {
          store.dispatch(redux_setMessageIA("Quitate los lentes"));
        } else if (!lighting) {
          store.dispatch(
            redux_setMessageIA("Se requiere de una mejor iluminación")
          );
        } else if (!occlusion) {
          store.dispatch(redux_setMessageIA("Se está bloqueando el rostro"));
        } else if (!hat) {
          store.dispatch(redux_setMessageIA("Quitate los lentes"));
        } else if (!pose) {
          store.dispatch(
            redux_setMessageIA("Enderezate y mira hacia la cámara")
          );
        } else if (glasses && lighting && occlusion && hat && pose) {
          debugger
          console.log("Imagen buena", response.predictions)
          store.dispatch(redux_setMessageIA(null));
        }
      }
    } catch (e) {}
  });

  // Event listener para cuando se cierra la conexión
  socket.addEventListener("close", function (event) {
    console.warn("WebSocket CERRADO");
  });

  // Event listener para errores
  socket.addEventListener("error", function (event) {
    console.warn("WebSocket ERROR:", event);
  });

  return socket;
}

// Función para enviar mensajes al WebSocket
export function sendMessage(socket, jsonObj) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(jsonObj));
    console.warn("Message sent to server:", jsonObj);
  } else {
    console.warn("sendMessage", {
      socket,
      readyState: socket.readyState,
      WebSocket: WebSocket.OPEN,
      jsonObj,
    });
    console.error("WebSocket is not open. Cannot send message.");
  }
}
