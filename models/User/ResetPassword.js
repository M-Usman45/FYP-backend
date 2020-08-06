const mongoose = require("mongoose");
const Joi = require("joi");

const resetPassword = mongoose.model(
  "ResetPassword",
  mongoose.Schema({
    email: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: Number,
      required: true,
    },
  })
);

function validateRP(user) {
  const Schema = {
    email: Joi.string().max(255).required().email(),
    code: Joi.number().required(),
  };
  return Joi.validate(resetPassword, Schema);
}

exports.ResetPassword = resetPassword;
exports.validate = validateRP;
