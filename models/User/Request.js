const mongoose = require("mongoose")
const Joi = require("joi")
const User = require("./User")


const request = mongoose.model("Request", mongoose.Schema({
    title: {
        type: String,
        maxlenght: 255,
        required: true
    },
    assetTitle: {
        type: String,
        maxlenght: 255,
        required: true
    },
    issueDate: {
        type: String,
        required: true

    },
    returnDate: {
        type: String,
        required: true

    },
    description: {
        type: String,
        maxlenght: 1000,
        required: true
    },
    status: {
        type: String,
        maxlenght: 255,
        required: true
    },
    sendDate: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}))

function validateRequest(request) {

    const Schema = {
        title: Joi.string().max(255).required(),
        assetTitle: Joi.string().max(255).required(),
        issueDate: Joi.date().required(),
        returnDate: Joi.date().required(),
        description: Joi.string().max(1000).required(),     
    }
    return Joi.validate(request, Schema)
}

exports.Request = request;
exports.validate = validateRequest;