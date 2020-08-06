const mongoose = require("mongoose")
const Joi = require("joi")

const anounce = mongoose.model("Anouncement", mongoose.Schema({
    title: {
        type: String,
        maxlenght: 255,
        required: true
    },
    description: {
        type: String,
        maxlenght: 1000,
        required: true
    },
    date: {

        type: Date,
        default: Date.now

    }
}))

function validateAnounce(anounce) {

    const Schema = {
        title: Joi.string().max(255).required(),
        description: Joi.string().max(1000).required()
    }
    return Joi.validate(anounce, Schema)
}

exports.Anouncement = anounce;
exports.validate = validateAnounce;
