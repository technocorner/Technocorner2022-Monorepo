export default process.env.NODE_ENV === "development"
  ? "ws://localhost:8080/ws"
  : "wss://api.final.eec.technocorner.id/ws";
