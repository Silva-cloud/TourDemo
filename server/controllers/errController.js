const AppError = require('../utils/appError');
//handle function for the error response in development
const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stak: err.stak,
  });
};
//handle function for the error response in production
const sendErrorProd = (res, err) => {
  //operational error that we trust, send to the client
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  //programming or other unknown error don't leak error details to the client
  else {
    //1) log the error for us developers to see it
    console.error('Error:->', err);
    //2)Send a generic message to the client (not leaking err details)
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!!',
    });
  }
};

//handleCastError function
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

//handling Duplicate Fields
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${Object.values(err.keyValue).join(
    '. '
  )}. Please use another value`;
  return new AppError(400, message);
};

//validation Errors handining function
const handleValidationError = (err) => {
  const errors = Object.values(err.errors);
  errors.map((item) => item.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};
module.exports = (err, req, res, next) => {
  // console.log('isOper ', err.isOperational);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  // });
  // console.log('Env: ', process.env.NODE_ENV);
  // console.log('NODE_ENV', process.env.NODE_ENV == 'production');

  if (process.env.NODE_ENV == 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV.trim() == 'production') {
    let error = { ...err };
    console.log('------$$$-----', error);
    //name proprty of err get deleted in destructuring
    //that's why we used err.name in the below line (same goes for ValidationError)
    if (err.name == 'CastError') error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDuplicateFieldsDB(error);
    if (err.name == 'ValidationError') error = handleValidationError(error);
    sendErrorProd(res, error);
  }
};
