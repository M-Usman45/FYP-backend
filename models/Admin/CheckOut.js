const mongoose = require("mongoose");
const Joi = require("joi");

const checkOut = mongoose.model(
  "CheckOut",
  mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assetTitle: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true

  },
  returnDate: {
      type: Date,
      required: true

  }
  })
);

exports.Checkout = checkOut;
