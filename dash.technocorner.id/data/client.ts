export default process.env.NODE_ENV === "development"
  ? { main: "http://localhost:3000", dash: "http://localhost:3001" }
  : { main: "https://technocorner.id", dash: "https://dash.technocorner.id" };

// export default process.env.NODE_ENV === "development"
//   ? { main: "http://36.80.236.87:3000", dash: "http://36.80.236.87:3001" }
//   : { main: "https://technocorner.id", dash: "https://dash.technocorner.id" };
