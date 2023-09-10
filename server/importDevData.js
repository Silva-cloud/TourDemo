const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({ path: './config.env' });
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    'utf-8'
  )
);
console.log(tours);
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
// console.log(DB);
mongoose.connect(DB).then(() => console.log('DB connected successfully!'));
const importAllTours = async () => {
  await Tour.insertMany(tours);
  console.log('tours added');
  process.exit();
};

const deleteAllTours = async () => {
  await Tour.deleteMany({});
  console.log('tours deleted');
  process.exit();
};

console.log(process.argv[2]);
if (process.argv[2] === '--import') {
  importAllTours();
} else if (process.argv[2] === '--delete') {
  deleteAllTours();
}

// importAllTours();
