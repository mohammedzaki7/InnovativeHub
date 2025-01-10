const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");
const { body } = require("express-validator");

const shopController = require("../controllers/shopController");

// Home
router.get("/", shopController.getIndex);
// Get projects
router.get("/projects", shopController.getProjects);
// Get applications
router.get("/applications", shopController.getApplications);

// Get projects
router.get("/project/:projectId", shopController.getProject);
// Get application
router.get("/application/:applicationId", shopController.getApplication);

// Get user's cart
router.get("/your-cart", isAuth, shopController.getCart);

// Add to user's cart
router.post(
  "/your-cart",
  [body("amount").isInt({ gt: 0 })],
  isAuth,
  shopController.addToCart
);

// Remove from user's cart
router.delete("/your-cart", isAuth, shopController.removeFromCart);

// Checkout
router.get("/checkout", isAuth, shopController.getCheckout);

// Check if checkout succeeded
router.get("/checkout/success", isAuth, shopController.getCheckoutSuccess);

// Check if checkout failed then checkout again
router.get("/checkout/cancel", isAuth, shopController.getCheckout);

// Invest in an app
router.post(
  "/invest/:applicationId",
  [body("amountToInvest").isFloat({ gt: 0 })],
  isAuth,
  shopController.addInvestment
);

// Vote up for project
router.post("/vote", isAuth, shopController.vote);

// Add money
router.post(
  "/deposit-money",
  [body("deposit").isFloat({ gt: 0 })],
  isAuth,
  shopController.depositMoney
);

// Add money success
router.post(
  "/deposit-money-success",
  isAuth,
  shopController.depositMoneySuccess
);

// Withdraw money

router.post(
  "/withdraw-money",
  [body("amount").isFloat({ gt: 0 })],
  isAuth,
  shopController.withdrawMoney
);

router.post(
  "/application-add-comment/:applicationId",
  [body("comment").trim().isLength({ min: 1 })],
  isAuth,
  shopController.addCommentToApplication
);

router.post(
  "/project-add-comment/:projectId",
  [body("comment").trim().isLength({ min: 1 })],
  isAuth,
  shopController.addCommentToProject
);

module.exports = router;
