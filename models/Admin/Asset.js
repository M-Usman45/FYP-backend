const mongoose = require("mongoose");
const Joi = require("joi");

const asset = mongoose.model(
  "Asset",
  mongoose.Schema({
    title: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    image: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    brand: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    quantity: {
      type: Number,
      minlenght: 1,
      required: true,
    },
    price: {
      type: Number,
      minlenght: 1,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    assetImage: {
      type: String ,
      required: true
    },
    users: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        issueDate: {
          type: String,
        },
        returnDate: {
          type: String,
        },
      },
    ],
    category: {
         type: String,
         ref : "Category"
    }   
  })
);

function validateAsset(asset) {
  const Schema = {
    title: Joi.string().max(255).required(),
    brand: Joi.string().max(255).required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    purchaseDate: Joi.date().required(),
    assetImage: Joi.string().required(),
    category: Joi.string().required()
  };
  return Joi.validate(asset, Schema);
}

exports.Asset = asset;
exports.validate = validateAsset;
