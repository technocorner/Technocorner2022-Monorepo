export const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:2621"
    : process.env.NODE_ENV === "test"
    ? "36.80.236.87:2621"
    : "https://api.technocorner.id";

export const port =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? 2621
    : 443;
