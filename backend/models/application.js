const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  numberOfDownloads: {
    type: Number,
    required: true,
  },
  moneyEarned: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  investments: {
    type: Number,
    required: true,
  },
  maxInvestments: {
    type: Number,
    required: true,
  },
  percentageGivenAway: {
    type: Number,
    required: true,
  },
  investors: [
    {
      investorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      amountAndDate: [
        {
          amount: {
            type: Number,
          },
          date: {
            type: Date,
          },
        },
      ],
    },
  ],
  released: {
    type: Boolean,
    required: true,
  },
  dateReleased: {
    type: Date,
  },
  expectedReleaseDate: {
    type: Date,
  },
  imagesUrl: [
    {
      type: String,
    },
  ],
  additionalInfo: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  developers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  votes: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
