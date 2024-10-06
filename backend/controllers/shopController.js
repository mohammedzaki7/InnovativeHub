const { validationResult } = require("express-validator");
const Project = require("../models/project");
const Application = require("../models/application");
const User = require("../models/user");
const mongoose = require("mongoose");
const application = require("../models/application");
const stripe = require("stripe")(
  "sk_test_51Ov0xwHFn3SQGeRVkYkXTEyCrsQH0qnKzxuBs38Yr9QZzuiGLm4AI0YbcC8STQ5BckHBSEIYMa6lXtEpJEpRTNi600ztZZMLaS"
);

const NUMBER_OF_ITEMS_PER_PAGE = 3;

exports.getIndex = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("owner")
      .sort({ votes: -1 })
      .sort({ price: -1 })
      .limit(3);
    const applications = await Application.find()
      .populate("owner")
      .sort({ votes: -1 })
      .sort({ investments: -1 })
      .limit(3);
    if (!projects && !applications) {
      res
        .status(404)
        .json({ message: "There are currently no projects or applications" });
    }
    res.status(200).json({
      message: "Successfully retrieved projects and applications",
      projects: projects,
      applications: applications,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  const page = req.query.page || 1;
  const maxItems = parseInt(req.query.maxItems) || NUMBER_OF_ITEMS_PER_PAGE; // Get maxItems from query or use default
  try {
    const projectsCount = await Project.countDocuments();
    const projects = await Project.find()
      .populate("owner")
      .sort({ votes: -1 })
      .sort({ price: -1 })
      .skip((page - 1) * maxItems)
      .limit(maxItems);
    if (!projects) {
      const err = new Error("No projects are found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Retrieved projects successfully",
      projects: projects,
      projectsCount: projectsCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getApplications = async (req, res, next) => {
  const page = req.query.page || 1;
  const maxItems = parseInt(req.query.maxItems) || NUMBER_OF_ITEMS_PER_PAGE; // Get maxItems from query or use default
  try {
    const applicationsCount = await Application.countDocuments();
    const applications = await Application.find()
      .populate("owner")
      .sort({ votes: -1 })
      .sort({ investments: -1 })
      .skip((page - 1) * maxItems)
      .limit(maxItems);
    if (!applications) {
      const err = new Error("No applications are found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "Retrieved applications successfully",
      applications: applications,
      applicationsCount: applicationsCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const project = await Project.findById(projectId).populate("owner");
    if (!project) {
      const err = new Error("No project is found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "retrieved the project",
      project: project,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  try {
    const application = await Application.findById(applicationId).populate(
      "owner"
    );
    if (!application) {
      const err = new Error("No application is found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "retrieved the application",
      application: application,
    });
  } catch (err) {
    if (err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: "cart.projects.projectId", // Populate projectId in projects array
        model: "Project",
      })
      .populate({
        path: "cart.applications.applicationId", // Populate applicationId in applications array
        model: "Application",
      });

    if (!user) {
      const err = new Error("No user found");
      err.statusCode = 404;
      throw err;
    }
    let totalPrice = 0;
    // Filter out null or deleted projects and applications
    const validProjects = user.cart.projects.filter((item) => {
      if (item.projectId !== null) {
        totalPrice += item.projectId.price * item.amount;
        return item;
      }
    });
    const validApplications = user.cart.applications.filter((item) => {
      if (item.applicationId !== null) {
        totalPrice += item.applicationId.price * item.amount;
        return item;
      }
    });

    // Update the user's cart with the filtered valid projects and applications
    user.cart.projects = validProjects;
    user.cart.applications = validApplications;
    user.cart.totalPrice = +totalPrice;

    const cart = {
      projects: user.cart.projects.map((item) => ({
        projectId: item.projectId._id,
        amount: item.amount,
      })),
      applications: user.cart.applications.map((item) => ({
        applicationId: item.applicationId._id,
        amount: item.amount,
      })),
      totalPrice: user.cart.totalPrice,
    };

    // Save the updated user document (optional)
    await user.save();

    if (validProjects.length === 0 && validApplications.length === 0) {
      return res.status(200).json({ message: "Your cart is empty" });
    }

    res.status(200).json({
      message: "Retrieved your cart",
      cart: cart,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  const itemType = req.body.itemType;
  const itemId = req.body.itemId;
  let amount = parseInt(req.body.amount, 10);

  let type;
  let typeKey;

  try {
    // Validate item type and fetch corresponding document
    if (itemType === "Project") {
      const project = await Project.findById(itemId);
      type = "projects";
      typeKey = "projectId";
      if (!project) {
        const err = new Error("Project not found");
        err.statusCode = 404;
        throw err;
      }
    } else if (itemType === "Application") {
      const application = await Application.findById(itemId);
      type = "applications";
      typeKey = "applicationId";
      if (!application) {
        const err = new Error("Application not found");
        err.statusCode = 404;
        throw err;
      }
    } else {
      const err = new Error("This type is not defined");
      err.statusCode = 400; // 400 for bad request
      throw err;
    }

    // Fetch the user
    const user = await User.findById(req.userId)
      .populate({
        path: "cart.projects.projectId", // Populate projectId in projects array
        model: "Project",
      })
      .populate({
        path: "cart.applications.applicationId", // Populate applicationId in applications array
        model: "Application",
      })
      .exec();

    // Ensure cart is initialized
    if (!user.cart) {
      user.cart = { projects: [], applications: [], totalPrice: 0 };
    }

    let itemUpdated = false;
    let cartArray = user.cart[type];

    if (itemType === "Application") {
      const appsInAssets = user.assets.applications;
      const appExists = appsInAssets.some(
        (app) => app.applicationId.toString() === itemId
      );

      if (appExists) {
        return res.status(400).json({
          message: "This application is already in your assets",
        });
      }

      const ownApp = user.apps.includes(itemId);

      if (ownApp) {
        return res.status(400).json({
          message: "You already own this app",
        });
      }
    } else if (itemType === "Project") {
      const ownProject = user.projects.includes(itemId);

      if (ownProject) {
        return res.status(400).json({
          message: "You already own this project",
        });
      }
    }

    // Update existing item in the correct array
    for (const cartItem of cartArray) {
      if (cartItem[typeKey] && cartItem[typeKey]._id.toString() === itemId) {
        if (itemType === "Application") {
          return res.status(400).json({
            message: "This application is already in the cart",
          });
        }
        cartItem.amount += +amount;
        itemUpdated = true;
        break; // Exit loop once item is found and updated
      }
    }

    if (itemUpdated) {
      let totalPrice = 0;
      // Filter out null or deleted projects and applications
      const validProjects = user.cart.projects.filter((item) => {
        if (item.projectId !== null) {
          totalPrice += item.projectId.price * item.amount;
          return item;
        }
      });
      const validApplications = user.cart.applications.filter((item) => {
        if (item.applicationId !== null) {
          totalPrice += item.applicationId.price * item.amount;
          return item;
        }
      });

      // Update the user's cart with the filtered valid projects and applications
      user.cart.projects = validProjects;
      user.cart.applications = validApplications;
      user.cart.totalPrice = +totalPrice;

      const cart = {
        projects: user.cart.projects.map((item) => ({
          projectId: item.projectId._id,
          amount: item.amount,
        })),
        applications: user.cart.applications.map((item) => ({
          applicationId: item.applicationId._id,
          amount: item.amount,
        })),
        totalPrice: user.cart.totalPrice,
      };

      await user.save();
      return res.status(200).json({
        message: "Updated item in cart",
        cart: cart,
      });
    }

    // Add new item if not updated
    const newCartItem = {
      [typeKey]: itemId,
      amount: +amount, // Ensure amount is treated as a number
    };

    if (itemType === "Application") {
      amount = 1;
      newCartItem.amount = 1;
    }

    user.cart[type].push(newCartItem);

    // Calculate the total price
    let newItem;
    if (itemType === "Project") {
      newItem = await Project.findById(itemId);
    } else if (itemType === "Application") {
      newItem = await Application.findById(itemId);
    }

    let totalPrice = newItem.price * amount || 0;
    // Filter out null or deleted projects and applications
    const validProjects = user.cart.projects.filter((item) => {
      if (item.projectId !== null) {
        totalPrice += item.projectId.price * item.amount || 0;
        return item;
      }
    });
    const validApplications = user.cart.applications.filter((item) => {
      if (item.applicationId !== null) {
        totalPrice += item.applicationId.price * item.amount || 0;
        return item;
      }
    });

    // Update the user's cart with the filtered valid projects and applications
    user.cart.projects = validProjects;
    user.cart.applications = validApplications;
    user.cart.totalPrice = +totalPrice;

    const cart = {
      projects: user.cart.projects.map((item) => ({
        projectId: item.projectId._id,
        amount: item.amount,
      })),
      applications: user.cart.applications.map((item) => ({
        applicationId: item.applicationId._id,
        amount: item.amount,
      })),
      totalPrice: user.cart.totalPrice,
    };

    await user.save();
    res.status(200).json({
      message: "Added item to cart",
      cart: cart,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  const itemType = req.body.itemType;
  const itemId = req.body.itemId;

  let type;
  let typeKey;
  let itemToDelete;

  try {
    if (itemType === "Project") {
      type = "projects";
      typeKey = "projectId";
      itemToDelete = await Project.findById(itemId);
    } else if (itemType === "Application") {
      type = "applications";
      typeKey = "applicationId";
      itemToDelete = await Application.findById(itemId);
    }
    if (!itemToDelete) {
      const err = new Error("item not found");
      err.statusCode = 404;
      throw err;
    }

    const user = await User.findById(req.userId)
      .populate({
        path: "cart.projects.projectId", // Populate projectId in projects array
        model: "Project",
      })
      .populate({
        path: "cart.applications.applicationId", // Populate applicationId in applications array
        model: "Application",
      });

    if (!user) {
      const err = new Error("No user found");
      err.statusCode = 404;
      throw err;
    }

    user.cart[type] = user.cart[type].filter(
      (item) => item[typeKey] && item[typeKey]._id.toString() !== itemId
    );

    let totalPrice = 0;

    // Filter out null or deleted projects and applications
    const validProjects = user.cart.projects.filter((item) => {
      if (item.projectId !== null) {
        totalPrice += item.projectId.price * item.amount;
        return item;
      }
    });
    const validApplications = user.cart.applications.filter((item) => {
      if (item.applicationId !== null) {
        totalPrice += item.applicationId.price * item.amount;
        return item;
      }
    });

    // Update the user's cart with the filtered valid projects and applications
    user.cart.projects = validProjects;
    user.cart.applications = validApplications;
    user.cart.totalPrice = +totalPrice;

    const cart = {
      projects: user.cart.projects.map((item) => ({
        projectId: item.projectId._id,
        amount: item.amount,
      })),
      applications: user.cart.applications.map((item) => ({
        applicationId: item.applicationId._id,
        amount: item.amount,
      })),
      totalPrice: user.cart.totalPrice,
    };

    // Save the updated user document (optional)
    await user.save();

    res.status(200).json({
      message: "Deleted item and here is your cart",
      cart: cart,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: "cart.projects.projectId", // Populate projectId in projects array
        model: "Project",
      })
      .populate({
        path: "cart.applications.applicationId", // Populate applicationId in applications array
        model: "Application",
      });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    if (
      user.cart.projects.length === 0 &&
      user.cart.applications.length === 0
    ) {
      const err = new Error("Your cart is empty");
      err.statusCode = 400;
      throw err;
    }
    const products = [];
    const projects = [];
    const applications = [];

    let totalPrice = 0;
    user.cart.projects.forEach((project) => {
      if (project.projectId) {
        totalPrice += project.projectId.price * project.amount;
        products.push({
          id: project.projectId._id,
          title: project.projectId.title,
          description: project.projectId.description,
          amount: project.amount,
          type: "Project",
          price: project.projectId.price,
        });
        projects.push({
          projectId: project.projectId._id,
          amount: project.amount,
        });
      }
    });

    user.cart.applications.forEach((application) => {
      if (application.applicationId) {
        totalPrice += application.applicationId.price * application.amount;
        products.push({
          id: application.applicationId._id,
          title: application.applicationId.title,
          description: application.applicationId.description,
          amount: application.amount,
          type: "Application",
          price: application.applicationId.price,
        });
        applications.push({
          applicationId: application.applicationId._id,
          amount: application.amount,
        });
      }
    });

    user.cart.projects = projects;
    user.cart.applications = applications;
    user.cart.totalPrice = +totalPrice;

    await user.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: products.map((p) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.title,
              description: p.description,
            },
            unit_amount: p.price * 100,
          },
          quantity: p.amount,
        };
      }),
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    });

    res.status(200).json({
      message: "Checkout!",
      products: products,
      totalPrice: totalPrice,
      session: session.id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCheckoutSuccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: "cart.projects.projectId", // Populate projectId in projects array
        model: "Project",
      })
      .populate({
        path: "cart.applications.applicationId", // Populate applicationId in applications array
        model: "Application",
      });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    if (
      user.cart.projects.length === 0 &&
      user.cart.applications.length === 0
    ) {
      const err = new Error("Your cart is empty");
      err.statusCode = 400;
      throw err;
    }

    // Process projects in the cart
    for (const project of user.cart.projects) {
      if (project.projectId) {
        const projectOwner = await User.findById(project.projectId.owner);
        projectOwner.moneyInBank += +(project.projectId.price * project.amount);
        await projectOwner.save();

        user.assets.projects.push({
          projectId: project.projectId._id,
          amount: project.amount,
          purchaseDate: new Date(),
        });
      }
    }

    // Process applications in the cart
    for (const application of user.cart.applications) {
      if (application.applicationId) {
        const applicationOwner = await User.findById(
          application.applicationId.owner
        );
        applicationOwner.moneyInBank += +(
          application.applicationId.price * application.amount
        );
        await applicationOwner.save();

        user.assets.applications.push({
          applicationId: application.applicationId._id,
          amount: application.amount,
          purchaseDate: new Date(),
        });
      }
    }

    // Clear the cart
    user.cart.projects = [];
    user.cart.applications = [];
    user.cart.totalPrice = 0;

    await user.save();
    res.status(200).json({
      message: "successfully added to your assets",
      assets: user.assets,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addInvestment = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  const amountToInvest = req.body.amountToInvest;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validating the data failed");
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }

  try {
    const application = await Application.findById(applicationId);
    const user = await User.findById(req.userId);
    if (!application) {
      const err = new Error("Application is not found");
      err.statusCode = 404;
      throw err;
    }
    if (application.owner._id.toString() === req.userId) {
      const err = new Error("Can't invest in your application");
      err.statusCode = 400;
      throw err;
    }
    if (
      application.investments + +amountToInvest >
      application.maxInvestments
    ) {
      const err = new Error(
        "Can't exceed the limit of investments for this application"
      );
      err.statusCode = 400;
      throw err;
    }

    if (amountToInvest < 0 || amountToInvest > user.moneyInBank) {
      const err = new Error("Investing process failed");
      err.statusCode = 400;
      throw err;
    }
    application.investments += +amountToInvest;

    const investorExists = application.investors.some((investor) => {
      if (investor.investorId.toString() === req.userId) {
        investor.amountAndDate.push({
          amount: amountToInvest,
          date: new Date(),
        });
        return true;
      }
      return false;
    });
    if (!investorExists) {
      application.investors.push({
        investorId: req.userId,
        amountAndDate: [
          {
            amount: amountToInvest,
            date: new Date(),
          },
        ],
      });
    }
    user.moneyInBank -= amountToInvest;

    await application.save();
    await user.save();

    res.status(200).json({
      message: "Investment succeeded",
      application: application,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.vote = async (req, res, next) => {
  const itemType = req.body.itemType;
  const itemId = req.body.itemId;
  try {
    if (itemType === "Project") {
      const project = await Project.findById(itemId);
      if (!project) {
        const err = new Error("Project not found");
        err.statusCode = 404;
        throw err;
      }
      const user = await User.findById(req.userId);
      votedAlready = user.votes.projects.some((proj) => {
        return proj.projectId.toString() === itemId;
      });
      if (votedAlready) {
        user.votes.projects.pull({
          projectId: itemId,
        });
        project.votes -= 1;
        await user.save();
        await project.save();
        return res.status(200).json({
          message: "User removed the vote from the project",
          project: project,
        });
      } else {
        user.votes.projects.push({
          projectId: itemId,
        });
        project.votes += 1;
        await user.save();
        await project.save();
        return res.status(200).json({
          message: "User voted for the project",
          project: project,
        });
      }
    } else if (itemType === "Application") {
      const application = await Application.findById(itemId);
      if (!application) {
        const err = new Error("Application not found");
        err.statusCode = 404;
        throw err;
      }
      const user = await User.findById(req.userId);
      votedAlready = user.votes.applications.some((app) => {
        return app.applicationId.toString() === itemId;
      });
      if (votedAlready) {
        user.votes.applications.pull({
          applicationId: itemId,
        });
        application.votes -= 1;
        await user.save();
        await application.save();
        return res.status(200).json({
          message: "User removed the vote from the application",
          application: application,
        });
      } else {
        user.votes.applications.push({
          applicationId: itemId,
        });
        application.votes += 1;
        await user.save();
        await application.save();
        return res.status(200).json({
          message: "User voted for the application",
          application: application,
        });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.depositMoney = async (req, res, next) => {
  const userId = req.userId;
  const deposit = req.body.deposit;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: deposit * 100,
      currency: "usd",
      metadata: { userId: userId },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.depositMoneySuccess = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const userId = paymentIntent.metadata.userId;
      const amountReceived = paymentIntent.amount;

      // Update the user's bank balance
      const user = await User.findById(userId);
      user.moneyInBank += amountReceived / 100; // Convert cents to dollars
      await user.save();

      res
        .status(200)
        .json({ message: "Deposit successful", moneyInBank: user.moneyInBank });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.withdrawMoney = async (req, res, next) => {
  try {
    const userId = req.userId;
    const amount = req.body.amount; // Amount in dollars
    const stripeAccountId = "acct_1Ov0xwHFn3SQGeRV";
    const destinationAccountId = req.body.destinationAccountId;

    // Find the user and ensure they have enough balance
    const user = await User.findById(userId);
    if (user.moneyInBank < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Create a payout to the connected account's bank account or debit card
    const payout = await stripe.payouts.create(
      {
        amount: amount * 100, // Amount in dollars
        currency: "usd",
        destination: "btok_us_verified", // Use the test bank token or a real test bank account ID, should be changedd to destinationAccountId
        method: "standard",
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    // Update the user's bank balance
    user.moneyInBank -= amount;
    await user.save();

    res.status(200).json({ message: "Withdrawal successful", payout });
  } catch (err) {
    console.error("Error processing withdrawal:", err); // Log the error
    res.status(500).json({ message: err.message });
  }
};

// don't forget to test at line 619 and 632 and add that u can't add something to the cart that u already own!

exports.addCommentToApplication = async (req, res, next) => {
  const applicationId = req.params.applicationId;
  try {
    const application = await Application.findById(applicationId);
    const userMail = req.userMail;
    if (!application) {
      const err = new Error("No application is found");
      err.statusCode = 404;
      throw err;
    }
    const comment = req.body.comment;
    application.comments.push({
      userMail: userMail,
      comment: comment,
      date: new Date(),
    });
    await application.save();
    res.status(200).json({
      message: "Successfully added the comment to the application",
      application: application,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
