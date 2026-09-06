import Tour from "../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlerFactory.js";
import AppError from "../utils/appError.js";

export function aliasTopTours(req, res, next) {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}

export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour, { path: "reviews" });
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// "/tours-within/:distance/center/:latlng/unit/:unit"
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",").map(Number);
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      ),
    );
  }

  if (unit !== "mi" && unit !== "km") {
    return next(
      new AppError(
        "Measuring unit entered is not supported, please enter either km or mi",
        400,
      ),
    );
  }
  // console.log(distance, lat, lng, unit);

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
