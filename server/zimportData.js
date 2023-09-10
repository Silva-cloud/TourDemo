const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({ path: `${__dirname}/config.env` });
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    'utf-8'
  )
);
console.log(tours);
const DB2 = process.env.DB_LOCAL;
mongoose.connect(DB2).then(() => console.log('connected to Local DB'));
const toursImport = async () => {
  await Tour.create(tours);
  console.log('Tours Added');
  process.exit();
};
const toursDelete = async () => {
  await Tour.deleteMany();
  console.log('Tours deleted');
  process.exit();
};
// console.log(process.argv);
// console.log(tours);

if (process.argv[2] === '--import') {
  toursImport();
} else if (process.argv[2] === '--delete') {
  toursDelete();
}
