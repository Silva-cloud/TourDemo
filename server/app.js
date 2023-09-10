const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
//for cors, i.e: to tell browser you are allowed to make
//request to this server:

const corsOptions = {
  origin: 'https://tourapp123.netlify.app',
  //for delete request to be accepted from browser:
  credentials: true,
};

app.use(cors(corsOptions));

//--end of cors
app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));
// app.use(express.static(`${__dirname}/starter/public/img/users`))
// app.use((req, res, next)=>{
//     console.log("Hello from the middleware!!!")
//     next();
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get("/api/v1/tours", getAllTours);

// app.get("/api/v1/tours/:id/:x?/:y?", getASpecificTour);

// app.post("/api/v1/tours", saveATour);

// app.patch("/api/v1/tours/:id", editATour);

// app.delete("/api/v1/tours/:id", deleteATour);

//routes

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} doesn't exist on this server!`,
  // });
  // const err = new Error(
  //   `can't find ${req.originalUrl} doesn't exist on this server!`
  // );
  // err.statusCode = 404;
  // err.status = 'fail';
  next(
    new AppError(
      404,
      `can't find ${req.originalUrl} doesn't exist on this server!`
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;

//server listening
