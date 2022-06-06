import express, { NextFunction } from "express";
import compression from "compression";
import actuator from "express-actuator";
import cookieSession from "cookie-session";
import Keygrip from "keygrip";
import * as Sentry from "@sentry/node";
import helmet from "helmet";
import cors from "cors";
import os from "os";
import dashboard from "./dashboard";
import auth from "./auth";
import { dash, main } from "../data/client";
import link from "./ln";
import proxy from "./proxy";
import linkTree from "./linktree";

process.env.TZ = "Asia/Jakarta";

const app = express();
app.use(compression());

Sentry.init({
  environment: `${
    process.env.NODE_ENV === "development" ? "development" : "production"
  } | ${os.hostname()}`,
  dsn: "https://28bc19e962e540058a86421b4aeedc01@o1088445.ingest.sentry.io/6103182",
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || [main, dash].indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

const date0 = new Date();
const date1 = new Date(new Date().setMonth(date0.getMonth() - 1));

const key = [
  date0.getMonth().toString() + date0.getFullYear().toString(),
  date1.getMonth().toString() + date1.getFullYear().toString(),
];

app.use(
  cookieSession({
    name: "session",
    domain:
      process.env.NODE_ENV === "development"
        ? "localhost"
        : process.env.NODE_ENV === "test"
        ? "36.80.236.87"
        : "technocorner.id",
    keys: Keygrip([key[0], key[1]], "SHA384", "base64"),
    maxAge:
      process.env.NODE_ENV === "development"
        ? 60 * 60 * 1000 // dev: expire in 60 minutes
        : 24 * 60 * 60 * 1000, // prod: expire in 1 day
  })
);

app.use((req, res, next) => {
  console.log(
    `Request [${req.method}] to ${req.path} accepted from ${
      req.ip
    } at ${new Date(Date.now())}`
  );
  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every 30 minutes so that it's not sent with every request
  if (req.session!.ref) {
    req.session!.nowInMinutes = Math.floor(Date.now() / 1800e3);
  }
  next();
});

app.use("/dashboard", dashboard);
app.use("/auth", auth);
app.use("/linktree", linkTree);
app.use("/ln", link);
app.use(
  "/proxy",
  (req, res, next) => {
    // Workaround. Don't know why this is required.
    res.setHeader("cross-origin-resource-policy", "cross-origin");
    next();
  },
  proxy
);
app.use(
  "/avatar",
  (req, res, next) => {
    // Workaround. Don't know why this is required.
    const origin = req.get("origin");
    if (!origin || [main, dash].indexOf(origin) !== -1) {
      res.setHeader("cross-origin-resource-policy", "cross-origin");
    }
    next();
  },
  express.static(__dirname + "/../assets/avatar")
);

app.get("/", (req, res) => {
  return res.redirect("/health");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error(`Sentry error in ${os.hostname()}!`);
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  console.error(err.stack);
  return res
    .status(500)
    .json({
      success: false,
      body: {
        error: err.message,
        id: (res as typeof res & { sentry: string }).sentry,
      },
    })
    .end();
});

app.use(actuator());

export default app;
