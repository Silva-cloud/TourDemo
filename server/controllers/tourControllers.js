const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTours = catchAsync(async (req, res) => {
  //   res.status(200).json({
  //     status: 'success',
  //     requestedAt: req.requestTime,
  //     results: tours.length,
  //     tours,
  //   });
  ///////////////////////////////////////////

  // try {
  // //Building the Query
  // const filterQueriesOnly = { ...req.query };
  // const nonFilterQueries = ['page', 'sort', 'fields', 'limit'];
  // nonFilterQueries.forEach((item) => delete filterQueriesOnly[item]);
  // console.log(req.query, filterQueriesOnly);
  const features = new ApiFeatures(Tour.find(), req.query);
  features
    .filter()
    .sort()
    .project()
    .paginate(await Tour.find({ secretTour: { $ne: true } }).countDocuments());
  // .paginate(await Tour.countDsocuments());
  // // advanced querying
  // console.log('string query:  ', JSON.stringify(query));
  // const queryStr = JSON.stringify(filterQueriesOnly).replace(
  //   /\b(gt|lt|lte|gte)\b/g,
  //   (match) => `$${match}`
  // );
  // let query = Tour.find(JSON.parse(queryStr));
  // console.log('qqw   ', !!req.query.page && !!req.query.limit);
  // //sorting
  // console.log(req.query);
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   // console.log('sortBy ', sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt name');
  // }
  // // projection
  // if (req.query.fields) {
  //   const projects = req.query.fields.split(',').join(' ');
  //   query = query.select(projects);
  // } else {
  //   query = query.select('-__v');
  // }
  // //pagination
  // const pageNum = req.query.page || 1;
  // const limit = req.query.limit || 100;
  // const skip = (pageNum - 1) * limit;
  // if (req.query.page) {
  //   console.log('pageNum: ', pageNum - 1);
  //   const toursNum = await Tour.countDocuments();
  //   console.log('skip: ', skip, 'toursNum ', toursNum);
  //   if (skip >= toursNum) {
  //     throw new Error("this page doesn't exists");
  //   }
  // }
  // query = query.skip(skip).limit(limit);
  // // console.log('pageNum: ', pageNum);
  // // console.log('skip: ', skip);

  //Executing query
  const tours = await features.query;
  // console.log('executed query--> ', tours);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  // }
  // catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
});

exports.getASpecificTour = catchAsync(async (req, res, next) => {
  //   res.status(200).json({
  //     status: 'success',
  //     result: 1,
  //     tour: req.tour,
  //   });
  // try {
  const tour = await Tour.findById(req.params.id);
  // console.log('ffff  ', tour._id);
  // if (tour !== null) {
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
  // } else throw new Error('no tour was found');
  // } else next(new AppError(404, 'no tour was found'));
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
  if (!tour) {
    return next(new AppError(404, 'no tour found with that ID'));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.saveATour = catchAsync(async (req, res, next) => {
  /////////////////////////////////////////////////////////
  // const newTour = Object.assign({id:tours[tours.length-1].id + 1}, req.body);
  //   const newTour = { id: tours[tours.length - 1].id + 1, ...req.body };
  //   tours.push(newTour);
  //   fs.writeFile(
  //     `${__dirname}/../starter/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       if (err) console.log('Error writing file!!!');

  //////////////////////////////////////////////////////////
  // try {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    result: 1,
    newTour,
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.editATour = catchAsync(async (req, res, next) => {
  ////////////////////////////////////////////////////////////////////
  //   let editedTour = tours.find((item) => item.id === req.params.id * 1);
  //   // editedTour= Object.assign(editedTour, req.body);
  //   editedTour = { ...editedTour, ...req.body };
  //   res.status(200).json({
  //     status: 'success',
  //     data: { editedTour },
  //   });
  ///////////////////////////////////////////////////////////////////////
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log('edit tour   ', tour);
  // if (tour !== null)
  // res.status(200).json({
  //   status: 'success',
  //   data: tour,
  // });
  // else throw new Error("the tour can't be found");
  // else next(new AppError(404, "the tour can't be found"));
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
  if (!tour) {
    return next(new AppError(404, 'no tour found with that ID'));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.deleteATour = catchAsync(async (req, res, next) => {
  ////////////////////////////////////////////////////////////////////////////////
  //   const deletedTour = tours.find((item) => item.id === req.params.id * 1);
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  //////////////////////////////////////////////////////////////////////////////
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  // if (tour !== null)
  // res.status(204).json({
  //   status: 'success',
  //   data: tour,
  // });
  // else throw new Error("there's no such tour");
  // else next(new AppError(404, "there's no such tour"));
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
  if (!tour) return next(new AppError(404, 'no tour found with that ID'));
  res.status(204).json({
    status: 'success',
    data: tour,
  });
});

// exports.checkID = (req, res, next, val) => {
//   // console.log(`id is ${val} and it's type is ` ,typeof val);
//   const tour = tours.find((item) => val * 1 === item.id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid ID',
//     });
//   }
//   req.tour = tour;
//   next();
// };

// exports.checkAddedTour = (req, res, next) => {
//   const tour = req.body;
//   if (!tour.name || !tour.price)
//     return res.status(400).json({
//       status: 'failed',
//       message: `invalid tour name or tour price`,
//     });
//   next();
// };
exports.top5CheapAliase = (req, res, next) => {
  req.query.sort = '-ratingsAverage price';
  req.query.limit = 5;
  req.query.fields = 'name price summary difficulty ratingsAverage';
  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  // try {
  const tourStatus = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        toursNum: { $sum: 1 },
        ratingsNum: { $sum: '$ratingsQuantity' },
        avgRating: { $sum: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
    // {
    //   $limit: 1,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    results: tourStatus.length,
    data: {
      tourStatus,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  // try {
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date('2021-01-01'),
          $lte: new Date('2021-12-31'),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        toursNum: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        toursNum: -1,
      },
    },
    // {
    //   $limit: 3,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    results: monthlyPlan.length,
    data: {
      monthlyPlan,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err.message,
  //   });
  // }
});
