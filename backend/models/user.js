const mongoose = require("mongoose");
const application = require("./application");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  moneyInBank: {
    type: Number,
    required: true,
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  apps: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  investedIn: [
    {
      app: {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
      amount: {
        type: Number,
      },
    },
  ],
  cart: {
    projects: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
        },
        amount: {
          type: Number,
        },
      },
    ],
    applications: [
      {
        applicationId: {
          type: Schema.Types.ObjectId,
          ref: "Application",
        },
        amount: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
  },

  purchases: {
    projects: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
        },
        amount: {
          type: Number,
        },
        purchaseDate: {
          type: Date,
        },
      },
    ],
    applications: [
      {
        applicationId: {
          type: Schema.Types.ObjectId,
          ref: "Application",
        },
        amount: {
          type: Number,
        },
        purchaseDate: {
          type: Date,
        },
      },
    ],
  },
  votes: {
    projects: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
        },
      },
    ],
    applications: [
      {
        applicationId: {
          type: Schema.Types.ObjectId,
          ref: "Application",
        },
      },
    ],
  },
  invitationTokens: {
    projects: [
      {
        token: {
          type: String,
          unique: true,
        },
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
        },
        expiration: Date,
      },
    ],
    applications: [
      {
        token: {
          type: String,
          unique: true,
        },
        applicationId: {
          type: Schema.Types.ObjectId,
          ref: "Application",
        },
        expiration: Date,
      },
    ],
  },
  projectsInvitedIn: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  applicationsInvitedIn: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
