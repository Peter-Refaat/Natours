// review -> rating / createdAt / ref to tour & user
import { Schema, model } from "mongoose";
import Tour from "./tourModel.js";

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

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name role",
  // });
  this.populate({
    path: "user",
    select: "name role",
  });
});

reviewSchema.statics.calcAverageRating = async function (tourID) {
  // this points to the Review model
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourID,
      },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    // reset to default values
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  // this points to current review (document)
  // this.constructor points to the current model (Review)
  await this.constructor.calcAverageRating(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  // doc is the updated/deleted review document
  if (doc) {
    await doc.constructor.calcAverageRating(doc.tour);
  }
});

// alternate solution to prevent duplicate reviews
// reviewSchema.pre("save", async function () {
//   const duplicate = this.constructor.findOne({
//     user: this.user,
//     tour: this.tour,
//   });
//   if (duplicate) {
//     throw new AppError(`Can't have multiple reviews for the same tour`);
//   }
// });

export default model("Review", reviewSchema);
