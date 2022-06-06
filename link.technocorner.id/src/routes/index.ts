import express from "express";
import helmet from "helmet";
import cors from "cors";
import link from "./link";
import { main } from "../data/client";

process.env.TZ = "Asia/Jakarta";

const app = express();

app.use((req, res, next) => {
  console.log(
    `Request [${req.method}] to ${req.path} accepted from ${
      req.ip
    } at ${new Date(Date.now())}`
  );
  next();
});

app.use(helmet());

app.use(cors());

app.get("/", (req, res) => {
  return res.redirect(`${main}/link`);
});

app.use("/", link);

export default app;
