const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/auth");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { uploadFiles } = require("../middleware/uploadingFiles");

// PROJECT

router.post(
  "/create-project",
  // Apply the uploadFiles middleware first to handle file uploads
  uploadFiles,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("please enter a description with at least 10 characters"),
    body("price").isNumeric().default("0"),
    body("forSell").isBoolean(),
  ],
  isAuth,
  adminController.createProject
);

router.put(
  "/update-project/:projectId",
  uploadFiles,
  [
    [
      body("title").trim().isLength({ min: 5 }),
      body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("please enter a description with at least 10 characters"),
      body("price").isNumeric().default("0"),
      body("forSell").isBoolean(),
    ],
  ],
  isAuth,
  adminController.updateProject
);

// router.get("/projects", isAuth, adminController.retrieveProjects);

router.delete(
  "/delete-project/:projectId",
  isAuth,
  adminController.deleteProject
);

// APPLICATION

router.post(
  "/upload-application",
  // Apply the uploadFiles middleware first to handle file uploads
  uploadFiles,
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long."),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please enter a description with at least 10 characters."),
    body("price")
      .isNumeric()
      .withMessage("Price must be a numeric value.")
      .default("0"),
    body("maxInvestments")
      .isNumeric()
      .withMessage("Max investments must be a numeric value.")
      .default("0"),
    body("percentageGivenAway")
      .isFloat({ min: 0.01, max: 0.5 }) // Ensures percentageGivenAway is a float between 0 and 0.5
      .withMessage("Percentage Given Away must be between 0 and 0.5.")
      .default("0"),
  ],
  isAuth,
  adminController.uploadApplication // Now this will have access to req.files
);

router.put(
  "/update-application/:applicationId",
  uploadFiles, // Add this middleware to handle file uploads
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long."),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please enter a description with at least 10 characters."),
    body("price")
      .isNumeric()
      .withMessage("Price must be a numeric value.")
      .default("0"),
    body("maxInvestments")
      .isNumeric()
      .withMessage("Max investments must be a numeric value.")
      .default("0"),
    body("percentageGivenAway")
      .isFloat({ min: 0.01, max: 0.5 }) // Ensures percentageGivenAway is a float between 0 and 0.5
      .withMessage("Percentage Given Away must be between 0 and 0.5.")
      .default("0"),
  ],
  isAuth,
  adminController.updateApplication
);

router.delete(
  "/delete-application/:applicationId",
  isAuth,
  adminController.deleteApplication
);

// Add user to project or application

router.post("/add-user/:itemId", isAuth, adminController.addUserToItem);

router.get("/getInvitation/:token", isAuth, adminController.getInvitation);

router.post(
  "/accept-invitation/:token",
  isAuth,
  adminController.acceptInvitation
);

router.post(
  "/reject-invitation/:token",
  isAuth,
  adminController.rejectInvitation
);

router.get("/my-assets", isAuth, adminController.retrieveApplicationsAndProjects);
router.get("/my-purchases", isAuth, adminController.retrievePurchasesApplicationsAndProjects);

module.exports = router;
