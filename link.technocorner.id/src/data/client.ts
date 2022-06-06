export const main =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NODE_ENV === "test"
    ? "http://36.80.236.87:3000"
    : "https://www.technocorner.id";

export const dash =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : process.env.NODE_ENV === "test"
    ? "http://36.80.236.87:3001"
    : "https://dash.technocorner.id";
