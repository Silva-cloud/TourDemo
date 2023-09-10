const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

console.log('process env ', process.env.Node_ENV);
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
const DB2 = process.env.DB_LOCAL;
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log('DB connection is successful'))
  .catch((err) => console.log('EEEEEE:  ', err));

const PORT = 8000 || process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELED REJECTION!  shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
