const { validationResult } = require("express-validator");
const Project = require("../models/project");
const Application = require("../models/application");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const yaml = require("js-yaml");
const fs = require("fs");

const {
  uploadFiles,
  deleteOldImages,
} = require("../middleware/uploadingFiles.js"); // Import the upload utility

// Load YAML config file
const config = yaml.load(fs.readFileSync("./utils/secrets.yaml", "utf8"));

const email = config.account.email;
const password = config.account.password;

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service, e.g., 'yahoo', 'hotmail', etc.
  auth: {
    user: email, // Your email address
    pass: password, // Your email password or app-specific password
  },
});

// PROJECT
exports.createProject = async (req, res, next) => {
  const errors = validationResult(req);
  // try {
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validating the data failed", data: errors.array() });
  }

  // Set imagesUrl to an empty array if no files are uploaded
  let imagesUrl = req.files ? req.files.map((file) => file.location) : [];

  // Extract information from the request
  // Extract the rest of the fields from the request body

  const title = req.body.title;
  const description = req.body.description;
  const numberOfOrders = 0;
  const forSell = req.body.forSell;
  let price = 0;
  if (forSell) {
    price = req.body.price;
  }
  const additionalInfo = req.body.additionalInfo;
  const owner = req.userId;
  const workers = [req.userId];
  const votes = 0;
  // let imagesUrl = [];

  // Create a new project instance
  const project = new Project({
    title,
    description,
    numberOfOrders,
    forSell,
    price,
    imagesUrl,
    additionalInfo,
    owner,
    workers,
    votes,
  });

  // Save the project

  try {
    await project.save();
    // Update the user with the new project
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    user.projects.push(project._id);
    await user.save();

    // Send response
    res.status(201).json({
      message: "New project added successfully",
      project,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("validation failed");
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }

  const title = req.body.title;
  const description = req.body.description;
  const forSell = req.body.forSell;
  let price = 0;
  if (forSell) {
    price = req.body.price;
  }
  const additionalInfo = req.body.additionalInfo;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    if (project.owner.toString() !== req.userId) {
      const err = new Error("Not authorized - forbidden");
      err.statusCode = 403;
      throw err;
    }

    // Delete old images before updating

    await deleteOldImages(project.imagesUrl);

    // Check if new files were uploaded
    let imagesUrl = req.files ? req.files.map((file) => file.location) : [];
    // If no new files were uploaded, keep the existing images
    if (imagesUrl.length === 0) {
      imagesUrl = project.imagesUrl; // Keep existing images
    }

    project.title = title;
    project.description = description;
    project.forSell = forSell;
    project.price = price;
    project.additionalInfo = additionalInfo;
    project.imagesUrl = imagesUrl;
    

    await project.save();
    res.status(200).json({
      message: "Successfully updated the project",
      project: project,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.retrieveProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.userId });
    if (projects.length === 0) {
      res.status(404).json({
        message: "No projects are found",
      });
    }
    res.status(200).json({
      message: "Retrieved projects successfully",
      projects: projects,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const projectToDelete = await Project.findById(projectId);
    if (!projectToDelete) {
      const err = new Error("Couldn't find the project");
      err.statusCode = 404;
      throw err;
    }
    if (projectToDelete.owner.toString() !== req.userId) {
      const err = new Error("Not authorized to delete this project");
      err.statusCode = 403;
      throw err;
    }
    // clearImage(post.imageUrl);
    await Project.findByIdAndDelete(projectId);
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    user.projects.pull(projectId);
    await user.save();
    res.status(200).json({
      message: "Project is deleted successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// APPLICATION

exports.uploadApplication = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validating the data failed", data: errors.array() });
  }

  // Set imagesUrl to an empty array if no files are uploaded
  let imagesUrl = req.files ? req.files.map((file) => file.location) : [];

  // Extract the rest of the fields from the request body
  const {
    title,
    description,
    price,
    maxInvestments,
    percentageGivenAway,
    additionalInfo,
    released,
    expectedReleaseDate,
  } = req.body;

  const owner = req.userId;
  const developers = [req.userId];
  let dateReleased = released ? new Date() : null;

  const application = new Application({
    title,
    description,
    numberOfDownloads: 0,
    moneyEarned: 0,
    price,
    investments: 0,
    investors: [],
    maxInvestments,
    percentageGivenAway,
    imagesUrl, // Save the image URLs (if any)
    additionalInfo,
    owner,
    developers,
    votes: 0,
    released,
    dateReleased,
    expectedReleaseDate: released ? null : expectedReleaseDate,
  });

  try {
    await application.save();
    const user = await User.findById(req.userId);
    user.apps.push(application._id);
    await user.save();

    res.status(201).json({
      message: "Successfully created the app",
      application: application,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validating the data failed");
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }

  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const maxInvestments = req.body.maxInvestments;
  const percentageGivenAway = req.body.percentageGivenAway;
  const released = req.body.released;
  const additionalInfo = req.body.additionalInfo;
  let dateReleased;
  let expectedReleaseDate;

  if (released) {
    dateReleased = new Date();
  } else {
    expectedReleaseDate = req.body.expectedReleaseDate;
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      const err = new Error("Application not found");
      err.statusCode = 404;
      throw err;
    }

    if (application.owner.toString() !== req.userId) {
      const err = new Error("Not authorized - forbidden");
      err.statusCode = 403;
      throw err;
    }

    // Delete old images before updating
    await deleteOldImages(application.imagesUrl);

    // Check if new files were uploaded
    let imagesUrl = req.files ? req.files.map((file) => file.location) : [];
    // If no new files were uploaded, keep the existing images
    if (imagesUrl.length === 0) {
      imagesUrl = application.imagesUrl; // Keep existing images
    }

    // Update application details
    application.title = title;
    application.description = description;
    application.price = price;
    application.maxInvestments = maxInvestments;
    application.percentageGivenAway = percentageGivenAway;
    application.released = released;
    application.imagesUrl = imagesUrl;
    application.additionalInfo = additionalInfo;
    application.dateReleased = dateReleased;
    application.expectedReleaseDate = expectedReleaseDate;

    await application.save();
    res.status(200).json({
      message: "Successfully updated the application",
      application: application,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.retrieveApplications = async (req, res, next) => {
  const userId = req.userId;
  try {
    const applications = await Application.find({ owner: userId });
    if (applications.length === 0) {
      return res.status(404).json({ message: "No appliations are found" });
    }
    return res.status(200).json({
      message: "Successfully retrieved applications",
      applications: applications,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  try {
    const applicationToDelete = await Application.findById(applicationId);
    if (!applicationToDelete) {
      const err = new Error("No application is found");
      err.statusCode = 404;
      throw err;
    }

    if (applicationToDelete.owner._id.toString() !== req.userId) {
      const err = new Error("Not authorized to delete the application");
      err.statusCode = 403;
      throw err;
    }

    await Application.findByIdAndDelete(applicationId);
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("No user is found");
      err.statusCode = 404;
      throw err;
    }
    user.apps.pull(applicationId);
    await user.save();
    res.status(200).json({
      message: "deleted the application successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addUserToItem = async (req, res, next) => {
  const itemId = req.params.itemId;
  const itemType = req.body.itemType;
  const userEmail = req.body.userEmail;
  try {
    const owner = await User.findById(req.userId);
    const userToAdd = await User.findOne({ email: userEmail });
    if (!userToAdd) {
      const err = new Error("User doesn't exist");
      err.statusCode = 404;
      throw err;
    }
    if (itemType === "Project") {
      const project = await Project.findById(itemId);
      if (!project) {
        const err = new Error("Project doesn't exist");
        err.statusCode = 404;
        throw err;
      }
      if (project.owner.toString() !== req.userId) {
        const err = new Error("This project doesn't belong to this user");
        err.statusCode = 403;
        throw err;
      }
      if (project.workers && project.workers.includes(userToAdd._id)) {
        const err = new Error(
          "User is already added to have access to the project"
        );
        err.statusCode = 400;
        throw err;
      }
      if (userToAdd.projectsInvitedIn.includes(itemId)) {
        const err = new Error("This user is already invited to this project");
        err.statusCode = 400;
        throw err;
      }
      const buffer = crypto.randomBytes(32);
      const token = buffer.toString("hex");

      // Ensure invitationTokens is initialized
      if (!userToAdd.invitationTokens) {
        userToAdd.invitationTokens = { projects: [], applications: [] };
      }
      userToAdd.invitationTokens.projects.push({
        token: token,
        projectId: itemId,
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week expiration
      });

      userToAdd.projectsInvitedIn.push(itemId);
      await userToAdd.save();
      const mailOptions = {
        from: "GoNow@gmail.com", // Sender address
        to: `${userEmail}`, // List of recipients
        subject: "Invitation to work on a project", // Subject line
        html: `Hello, ${owner.email} is inviting you to work on his project click 
                    <a href="http://localhost/admin/getInvitation/${token}?email=${userEmail}&ownerEmail=${owner.email}type=Project">here</a> to start working with them!`, // Plain text body
      };
      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Successfully sent an invitation mail to the user",
        userToAdd: userToAdd,
      });
    } else if (itemType === "Application") {
      const application = await Application.findById(itemId);
      if (!application) {
        const err = new Error("Application doesn't exist");
        err.statusCode = 404;
        throw err;
      }
      if (application.owner.toString() !== req.userId) {
        const err = new Error("This application doesn't belong to this user");
        err.statusCode = 403;
        throw err;
      }
      if (
        application.developers &&
        application.developers.includes(userToAdd._id)
      ) {
        const err = new Error(
          "User is already added to have access to the application"
        );
        err.statusCode = 400;
        throw err;
      }
      if (userToAdd.applicationsInvitedIn.includes(itemId)) {
        const err = new Error(
          "This user is already invited to this application"
        );
        err.statusCode = 400;
        throw err;
      }
      const buffer = crypto.randomBytes(32);
      const token = buffer.toString("hex");

      // Ensure invitationTokens is initialized
      if (!userToAdd.invitationTokens) {
        userToAdd.invitationTokens = { projects: [], applications: [] };
      }
      userToAdd.invitationTokens.applications.push({
        token: token,
        applicationId: itemId,
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week expiration
      });

      userToAdd.applicationsInvitedIn.push(itemId);
      await userToAdd.save();
      const mailOptions = {
        from: "GoNow@gmail.com", // Sender address
        to: `${userEmail}`, // List of recipients
        subject: "Invitation to work on a application", // Subject line
        html: `Hello, ${owner.email} is inviting you to work on his application click 
                    <a href="http://localhost/admin/getInvitation/${token}?email=${userEmail}&ownerEmail=${owner.email}type=Application">here</a> to start working with them!`, // Plain text body
      };
      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Successfully sent an invitation mail to the user",
        userToAdd: userToAdd,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getInvitation = async (req, res, next) => {
  const token = req.params.token;
  const type = req.body.type;
  const ownerEmail = req.body.ownerEmail;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("Invalid email or token");
      err.statusCode = 404;
      throw err;
    }

    if (type === "Project") {
      // Find the specific invitation token object
      const invitation = user.invitationTokens.projects.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the project
      const project = await Project.findById(invitation.projectId);
      if (!project) {
        const err = new Error("Project not found");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "retrieved the project successfully",
        project: project,
        userToAdd: user,
        ownerEmail: ownerEmail,
      });
    } else if (type === "Application") {
      // Find the specific invitation token object
      const invitation = user.invitationTokens.applications.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the application
      const application = await Application.findById(invitation.applicationId);
      if (!application) {
        const err = new Error("Application not found");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "retrieved the application successfully",
        application: application,
        userToAdd: user,
        ownerEmail: ownerEmail,
      });
    } else {
      const err = new Error("Type is not found");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  const token = req.params.token;
  const type = req.body.type;

  try {
    const userToAdd = await User.findById(req.userId);
    if (!userToAdd) {
      const err = new Error("Invalid email or token");
      err.statusCode = 404;
      throw err;
    }

    if (type === "Project") {
      // Find the specific invitation token object
      const invitation = userToAdd.invitationTokens.projects.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the project
      const project = await Project.findById(invitation.projectId);
      if (!project) {
        const err = new Error("Project not found");
        err.statusCode = 404;
        throw err;
      }

      project.workers.push(userToAdd._id);
      userToAdd.projects.push(project._id);
      userToAdd.projectsInvitedIn.pull(project._id);
      userToAdd.invitationTokens.projects =
        userToAdd.invitationTokens.projects.filter(
          (p) => p.projectId.toString() !== project._id.toString()
        );
      await project.save();
      await userToAdd.save();

      res.status(200).json({
        message: "User can now access the project",
        project: project,
        userToAdd: userToAdd,
      });
    } else if (type === "Application") {
      // Find the specific invitation token object
      const invitation = userToAdd.invitationTokens.applications.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the application
      const application = await Application.findById(invitation.applicationId);
      if (!application) {
        const err = new Error("Application not found");
        err.statusCode = 404;
        throw err;
      }

      application.developers.push(userToAdd._id);
      userToAdd.ap.push(application._id);
      userToAdd.applicationsInvitedIn.pull(application._id);
      userToAdd.invitationTokens.applications =
        userToAdd.invitationTokens.applications.filter(
          (app) => app.applicationId.toString() !== application._id.toString()
        );
      await application.save();
      await userToAdd.save();

      res.status(200).json({
        message: "User can now access the application",
        application: application,
        userToAdd: userToAdd,
      });
    } else {
      const err = new Error("Type is not found");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.rejectInvitation = async (req, res, next) => {
  const token = req.params.token;
  const type = req.body.type;

  try {
    const userToAdd = await User.findById(req.userId);
    if (!userToAdd) {
      const err = new Error("Invalid email or token");
      err.statusCode = 404;
      throw err;
    }

    if (type === "Project") {
      // Find the specific invitation token object
      const invitation = userToAdd.invitationTokens.projects.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the project
      const project = await Project.findById(invitation.projectId);
      if (!project) {
        const err = new Error("Project not found");
        err.statusCode = 404;
        throw err;
      }

      userToAdd.projectsInvitedIn.pull(project._id);
      userToAdd.invitationTokens.projects =
        userToAdd.invitationTokens.projects.filter(
          (p) => p.projectId.toString() !== project._id.toString()
        );
      await userToAdd.save();

      res.status(200).json({
        message: "User rejected to work on this project",
        project: project,
        userToAdd: userToAdd,
      });
    } else if (type === "Application") {
      // Find the specific invitation token object
      const invitation = userToAdd.invitationTokens.applications.find(
        (inv) => inv.token === token
      );
      if (!invitation) {
        const err = new Error("Invalid token");
        err.statusCode = 404;
        throw err;
      }
      // (Optional) Check if the token has expired
      if (invitation.expiration && invitation.expiration < Date.now()) {
        const err = new Error("Token has expired");
        err.statusCode = 400;
        throw err;
      }

      // Proceed with adding the user to the application
      const application = await Application.findById(invitation.applicationId);
      if (!application) {
        const err = new Error("Application not found");
        err.statusCode = 404;
        throw err;
      }

      userToAdd.applicationsInvitedIn.pull(application._id);
      userToAdd.invitationTokens.applications =
        userToAdd.invitationTokens.applications.filter(
          (app) => app.applicationId.toString() !== application._id.toString()
        );
      await userToAdd.save();

      res.status(200).json({
        message: "User rejected to work on this application",
        application: application,
        userToAdd: userToAdd,
      });
    } else {
      const err = new Error("Type is not found");
      err.statusCode = 400;
      throw err;
      
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};