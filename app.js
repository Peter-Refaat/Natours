import express, { json, static as expressStatic } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname } from "path";

import xssSanitizer from "./utils/deepSanitize.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from the body into req.body
app.use(json({ limit: "10kb" }));

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

// Serving static files
app.use(expressStatic(`${__dirname}/public`));

// Limit requests from the same IP
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log("HEADERSSSS", req.headers);
  next();
});

// 2) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
