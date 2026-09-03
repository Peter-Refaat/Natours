import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { deleteOne, updateOne, getOne, getAll } from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const ret = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      ret[el] = obj[el];
    }
  });
  return ret;
};

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
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
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

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const createUser = (req, res) => {
  res.stats(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getAllUsers = getAll(User);

export const getUser = getOne(User);

// Only Admin can do that
export const updateUser = updateOne(User);

// Only Admin can do that
export const deleteUser = deleteOne(User);
