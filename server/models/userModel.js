const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
    // minLength: [5, "a user's name must be at least 10 characters long"],
    // maxLength: [40, "a user's name must be at most 40 characters long"],
  },
  email: {
    type: String,
    required: [true, 'a user must have an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pleas provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'a password must be at least 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password!!'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
