export default process.env.NODE_ENV === "development"
  ? ["http://localhost:2126"]
  : [
      "https://api.technocorner.id",
      "https://api2.technocorner.id",
      "https://api3.technocorner.id",
      "https://api4.technocorner.id",
    ];

// export default process.env.NODE_ENV === "development"
//   ? ["http://36.80.236.87:2126"]
//   : [
//       "https://api.technocorner.id",
//       "https://api2.technocorner.id",
//       "https://api3.technocorner.id",
//     ];
