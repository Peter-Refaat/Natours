const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DOCUMENT MIDDLEWARE: runs before .save() & .create() commands
// called pre save hook or pre save middleware
tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre("save", () => {
//   console.log("Will Save Document...");
// });

// tourSchema.post("save", (doc) => {
//   console.log(doc);
// });

// QUERY MIDDLEWARE
// all strings that starts with find
tourSchema.pre(/^find/, function () {
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });
});

tourSchema.post(/^find/, function (docs) {
  console.log(Date.now() - this.start);
  console.log(docs);
});

tourSchema.virtual("durationWeeks").get(function () {
  return Math.floor(this.duration / 7);
});

module.exports = mongoose.model("Tour", tourSchema);
