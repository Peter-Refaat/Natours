// review -> rating / createdAt / ref to tour & user
import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "A review must have a text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "tour",
    select: "name",
  }).populate({
    path: "user",
    select: "name role",
  });
});

export default model("Review", reviewSchema);
