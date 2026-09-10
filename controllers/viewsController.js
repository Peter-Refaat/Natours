import Tour from "../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getOverview = catchAsync(async (req, res, next) => {
  // 1) get tours data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tours data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker",
  });
};
