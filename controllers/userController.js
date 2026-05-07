import { find, findByIdAndUpdate } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const filterObj = (obj, ...allowedFields) => {
  const ret = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      ret[el] = obj[el];
    }
  });
  return ret;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400,
      ),
    );
  }
  // 2) Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await findByIdAndUpdate(req.user._id, filteredBody, {
    returnDocument: "after",
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export function createUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
}

export function getUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
}

export function updateUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
}

export function deleteUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
}
