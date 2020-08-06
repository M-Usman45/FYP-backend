const mongoose = require("mongoose");
const Joi = require("joi");

const user = mongoose.model(
  "User",
  mongoose.Schema({
    firstname: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    lastname: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    email: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    password: {
      type: String,
      minlenght: 8,
      maxlenght: 1024,
      required: true,
    },
    department: {
      type: String,
      maxlenght: 255,
      required: true,
    },
    contactno: {
      type: Number,
      minlenght: 11,
      maxlenght: 255,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      required: true,
    },
    events: [
      {
        title: {
          type: String,
        },
        start: {
          type: String,
        },
        end: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  })
);

function validateUser(user) {
  const Schema = {
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().max(255).min(8).required(),
    department: Joi.string().max(255).required(),
    contactno: Joi.number().min(11).required(),
  };
  return Joi.validate(user, Schema);
}

function validateAdmin(user) {
  const Schema = {
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().max(255).required().email(),
    department: Joi.string().max(255).required(),
  };
  return Joi.validate(user, Schema);
}

function validateLogin(user) {
  const Schema = {
    email: Joi.string().max(255).required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, Schema);
}

exports.User = user;
exports.validate = validateUser;
exports.validateAdmin = validateAdmin;
exports.validateLogin = validateLogin;
