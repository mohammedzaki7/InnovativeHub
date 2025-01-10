const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  numberOfOrders: {
    type: Number,
    required: true,
  },
  forSell: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true
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
  workers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  votes: {
    type: Number,
    required: true,
  },
  comments: [
    {
      userMail: {
        type: String,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date
      }
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
