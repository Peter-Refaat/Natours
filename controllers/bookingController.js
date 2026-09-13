/* eslint-disable */
import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";
import catchAsync from "../utils/catchAsync.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlerFactory.js";
import AppError from "../utils/appError.js";
import createPaymentIntention from "../services/paymobService.js";

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) return next(new AppError("No tour found with that ID!", 404));
  // 2) create a Paymob payment intention
  const paymentReturnUrl = new URL(
    `/tour/${tour.slug}`,
    `${req.protocol}://${req.get("host")}`,
  );
  paymentReturnUrl.searchParams.set("tourID", tour.id.toString());
  paymentReturnUrl.searchParams.set("userID", req.user.id.toString());
  paymentReturnUrl.searchParams.set("price", tour.price.toString());

  const session = await createPaymentIntention({
    amount: tour.price,
    tour,
    user: req.user,
    redirectionUrl: paymentReturnUrl.toString(),
  });

  // 3) create session as response
  res.status(200).json({
    status: "success",
    session,
    checkoutURL: session.url,
  });
});

// TEMPORARY, becuase it's UNSECURE: everyone can make bookings without paying
export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tourID, userID, price } = req.query;

  if (!tourID || !userID || !price) return next();

  await Booking.create({
    tour: tourID,
    user: userID,
    price: Number(price),
  });

  res.redirect(req.originalUrl.split("?")[0]);
});

export const getAllBookings = getAll(Booking);
export const getBooking = getOne(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
export const createBooking = createOne(Booking);