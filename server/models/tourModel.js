const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minLength: [10, "a tour's name must be at least 10 characters long"],
      maxLength: [40, "a tour's name must be at most 40 characters long"],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['difficult', 'easy', 'medium'],
        message: 'a tour is either easy, medium or difficult',
      },
    },
    price: {
      required: [true, 'A tour must have a price'],
      type: Number,
    },
    priceDiscount: {
      type: Number,
      // validate: [
      //   function (val) {
      //     return val < this.price;
      //   },
      //   'priceDiscount should be lower than price',
      // ],
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'priceDiscount should be lower than price and entered value ({VALUE}) is higher',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'a tour must have a ratings average bigger than one'],
      max: [5, 'a tour must have a ratings average smaller than five'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: 'A tour must have a summary',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image Cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    //the below line because when using toJSON and toObject or may be when using mongoose.schema 2nd param
    // which is the schema option's parameter () the id field appear in the result try deleting the below line
    // and see that  two fields appear id and _id and when deleting the 2nd param alltogrther the id disappear
    //but we need it for the virtual property to appear
    id: false,
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', (next) => {
//   console.log('will save document');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startQuery = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`queryTime: ${Date.now() - this.startQuery} milliseconds`);
  // console.log(docs);
  next();
});

tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

// const newTour = new Tour({
//   name: 'The Mountainer',
//   price: 500,
// });

// newTour.save().then((doc) => console.log(doc));

module.exports = Tour;
