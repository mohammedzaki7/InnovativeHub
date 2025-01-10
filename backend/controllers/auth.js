const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User doesn't exist");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "secret",
      {
        expiresIn: "10h",
      }
    );
    res.status(200).json({
      token: token,
      message: "successfully logged in",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("validating the data failed");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const dateOfBirth = req.body.dateOfBirth;
  const moneyInBank = "0";
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        dateOfBirth: dateOfBirth,
        moneyInBank: moneyInBank,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User is successfully created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("Error - user not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Retreived user successfully",
      user: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
