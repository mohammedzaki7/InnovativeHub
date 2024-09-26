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

router.get("/projects", isAuth, adminController.retrieveProjects);

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
    body("title").trim().isLength({ min: 5 }),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please enter a description with at least 10 characters."),
    body("price").isNumeric().default("0"),
    body("maxInvestments").isNumeric().default("0"),
    body("percentageGivenAway").isNumeric().default("0"),
  ],
  isAuth,
  adminController.uploadApplication // Now this will have access to req.files
);

router.put(
  "/update-application/:applicationId",
  uploadFiles, // Add this middleware to handle file uploads
  [
    body("title").trim().isLength({ min: 5 }),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please enter a description with at least 10 characters."),
    body("price").isNumeric().default("0"),
    body("maxInvestments").isNumeric().default("0"),
    body("percentageGivenAway").isNumeric().default("0"),
  ],
  isAuth,
  adminController.updateApplication
);

router.get("/applications", isAuth, adminController.retrieveApplications);
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

module.exports = router;
