const apiServer =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:8082"]
    : ["https://api.penyisihan.eec.technocorner.id"];

const wsServer =
  process.env.NODE_ENV === "development"
    ? "ws://localhost:8082/websocket"
    : "wss://api.penyisihan.eec.technocorner.id/websocket";

const client =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://penyisihan.eec.technocorner.id";

export { apiServer, wsServer, client };

export default { apiServer, wsServer, client };
