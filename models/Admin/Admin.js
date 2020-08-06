const mongoose = require("mongoose")
const Joi = require("joi")

const admin = mongoose.model("Admin", mongoose.Schema({
    firstname: {
        type: String,
        maxlenght: 255,
        required: true
    },
    lastname: {
        type: String,
        maxlenght: 255,
        required: true
    },
    email: {
        type: String,
        maxlenght: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlenght: 4,
        maxlenght: 1024,
        required: true
    },
    contactno: {
        type: Number,
        minlenght: 11,
        maxlenght: 255,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
}))

function validateAdmin(admin) {

    const Schema = {
        firstname: Joi.string().max(255).required(),
        lastname: Joi.string().max(255).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).min(8).required(),
        contactno: Joi.number().min(11).required(),
    }
    return Joi.validate(admin, Schema)
}
function validateLogin(admin) {

    const Schema = {
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(11).max(255).required()
    }
    return Joi.validate(admin, Schema)
}

exports.Admin = admin;
exports.validate = validateAdmin;
exports.validateLogin = validateLogin