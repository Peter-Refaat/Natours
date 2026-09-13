/* eslint-disable */
import Tour from "../models/tourModel.js";
import { isValidObjectId } from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import createPaymentIntention from "../services/paymobService.js";

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) return next(new AppError("No tour found with that ID!", 404));
  // 2) create a Paymob payment intention
  const session = await createPaymentIntention({
    amount: tour.price,
    tour,
    user: req.user,
    redirectionUrl: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  });

  // 3) create session as response
  res.status(200).json({
    status: "success",
    session,
    checkoutURL: session.url,
  });
});
