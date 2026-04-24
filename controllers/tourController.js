const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    const page = +req.query.page || 1;
    if (req.query.page && page > 1) {
      if (!tours.length) {
        throw new Error("This Page Doesn't Exist");
      }
    }

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// exports.getAllTours = async (req, res) => {
//   try {
//     // console.log(req.query);
//     // const query = await Tour.find()
//     //   .where("duration")
//     //   .equals(5)
//     //   .where("difficulty")
//     //   .equals("easy");
//     // BUILD QUERY
//     // 1A) Filtering
//     const queryObj = { ...req.query };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     // console.log(req.query, queryObj);

//     // 1B) Advanced Filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // console.log(queryStr);

//     const filters = JSON.parse(queryStr);

//     let query = Tour.find(filters);

//     // 2) Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-createdAt");
//     }

//     // 3) Limiting Fields
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       query = query.select("-__v");
//     }

//     // 4) Pagination
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || 100;
//     const skip = limit * (page - 1);

//     query = query.skip(skip).limit(limit);

//     // EXECUTE QUERY
//     const tours = await query;

//     if (req.query.page && page > 1) {
//       if (!tours.length) {
//         throw new Error("This Page Doesn't Exist");
//       }
//     }

//     // SEND RESPONSE
//     res.status(200).json({
//       status: "success",
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save() RETURNS A PROMISE
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
