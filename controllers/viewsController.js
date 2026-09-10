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

export const getTour = catchAsync(async (req, res, next) => {
  // 1) get the data for the requested tour (including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  // 2) Build the template
  // 3) Render the template using data from 1)
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});
