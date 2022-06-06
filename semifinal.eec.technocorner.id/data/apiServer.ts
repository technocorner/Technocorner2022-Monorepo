export default process.env.NODE_ENV === "development"
  ? ["http://localhost:8081"]
  : ["https://api.semifinal.eec.technocorner.id"];
