import app from "./routes";
import serverless from "serverless-http";

module.exports.handler = serverless(app);
