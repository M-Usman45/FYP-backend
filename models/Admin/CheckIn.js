const mongoose = require("mongoose");
const Joi = require("joi");

const checkIn = mongoose.model(
  "CheckIn",
  mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
    returnDate:{
        type: Date,
        required: true
    }
  })
);

exports.CheckIn = checkIn;
