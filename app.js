import express, { json, static } from "express";
import morgan from "morgan";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//MIDDLEWARES
app.use(json());
app.use(static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("HEADERSSSS", req.headers);
  next();
});

//ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
