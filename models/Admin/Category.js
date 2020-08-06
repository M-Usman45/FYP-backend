const mongoose = require("mongoose");
const Joi = require("joi");

const category = mongoose.model(
  "Category",
  mongoose.Schema({
    name: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    assetsCount: {
      type: Number
      },

  })
);

function validateCategory(category) {
  const Schema = {
    name: Joi.string().max(255).required(),
    assetsCount: Joi.number().min(1),
  };
  return Joi.validate(category, Schema);
}

exports.Category = category;
exports.validate = validateCategory;
