import path from "path";
import express, { json, static as expressStatic } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import compression from "compression";

import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";

import xssSanitizer from "./utils/deepSanitize.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import viewRouter from "./routes/viewRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Serving static files
// app.use(expressStatic(`${__dirname}/public`));
app.use(expressStatic(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'"],
        connectSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
          "https://server.arcgisonline.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://unpkg.com",
          "https://server.arcgisonline.com",
        ],
        workerSrc: ["'self'", "blob:"],
      },
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from the body into req.body
app.use(json({ limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization agains NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS (cleans req.body, req.query & req.params)
app.use(xssSanitizer);

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Limit requests from the same IP
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(compression);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.sendStatus(204);
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
