const WebSocket = () => {
  // DESTINATIONS
  // PREVIEW = /user/flowsPreview

  // LOS MENSAJES LLEGAN A TRAVES DE = /user/topic/messages

  // ENVIAR FLUJOS A PUBLICAR = CIERRA SESION AL TERMINAR
  // client.send("/app/flowsPublish",{}, JSON.stringify({flowsIds: [arreglo con ids de los flujos]}));

  // ENVIAR FLUJOS A VISTA PREVIA =
  // client.send("/app/flowsPreview",{}, JSON.stringify({flowsIds: [arreglo con ids de los flujos]}));

  // ENVIAR
  const subscribeService = (stompClient, url, callback = () => {}, token) => {
    stompClient.connect(
      {
        Authorization: token,
      },
      function () {
        stompClient.subscribe(url, callback);
      }
    );
  };

  const unsubscribeService = (stompClient) => {
    try {
      if (stompClient) stompClient.disconnect();
    } catch (err) {
      console.error("WEBSOCKET - Error al desconectar el websocket: ", err.message)
    }
  };

  const clientSend = (stompClient, url, json, headers = {}) => {
    try {
      let token = "9caacf96f0a44e575be59d37f564559c"
  
      let newHeaders = { ...headers, Authorization: token };
      stompClient?.send(url, newHeaders, JSON.stringify(json));
    } catch (err) {
      console.error("WEBSOCKET - Error al enviar websocket: " + err.message)
    }
  };

  return {
    subscribeService,
    unsubscribeService,
    clientSend,
  };
};

export default WebSocket;
