const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is already taken");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Please enter a password"),
    body("name").trim().not().isEmpty().withMessage("Please enter your name"),
    body("dateOfBirth")
      .isDate()
      .withMessage("Please enter a valid date")
      .custom((value) => {
        const enteredDate = new Date(value);
        const today = new Date();
        if (enteredDate >= today) {
          throw new Error("Date of birth must be in the past");
        }
        return true; // If validation passes
      }),
  ],
  authController.signup
);
router.post("/login", authController.login);

module.exports = router;
