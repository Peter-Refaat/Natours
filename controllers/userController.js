import multer from "multer";
import sharp from "sharp";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { deleteOne, updateOne, getOne, getAll } from "./handlerFactory.js";

// if no image processing is required, just do it this way
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/img/users");
//   },
//   filename: function (req, file, cb) {
//     // user-id-current_time_stamp.extension
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// uploading a photo now goes to a buffer in memory first.
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  // to use it in the updateMe
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const ret = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      ret[el] = obj[el];
    }
  });
  return ret;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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
  if (req.file) filteredBody.photo = req.file.filename;

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
