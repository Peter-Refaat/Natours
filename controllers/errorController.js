import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const [[field, value]] = Object.entries(err.keyValue);
  const message = `Duplicate field value: ${value}. Please use another ${field}!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errorsMessages = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errorsMessages.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please login again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please login again.", 401);

const sendErrorDevAPI = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorDevWebsite = (err, res) => {
  console.log("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProdAPI = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.log("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

const sendErrorProdWebsite = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  console.log("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) return sendErrorDevAPI(err, res);
  return sendErrorDevWebsite(err, res);
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) return sendErrorProdAPI(err, res);
  return sendErrorProdWebsite(err, res);
};

export default (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log(error);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    error.message = err.message;
    sendErrorProd(error, req, res);
  }
};
