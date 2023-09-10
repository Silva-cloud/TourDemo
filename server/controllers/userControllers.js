const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.addUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  if (!newUser)
    res.status(400).json({
      status: 'fail',
      message: 'wrong entries',
    });
  else
    res.status(201).json({
      status: 'success',
      results: 1,
      newUser,
    });
});

exports.getUser = catchAsync(async (req, res) => {
  //   console.log(req.params.id);
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  console.log(user);
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted!',
  });
});
