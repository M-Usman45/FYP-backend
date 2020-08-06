const mongoose = require("mongoose")
const Joi = require("joi")
const User = require("./User")


const complain = mongoose.model("Complain", mongoose.Schema({
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
    status: {
        type: String,
        minlenght: 5,
        maxlenght: 255,
        required: true
    },
    sendDate: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})
)

function validateComplain(complain) {

    const schema = {
        title: Joi.string().max(255).required(),
        description: Joi.string().max(1000).required(),
        //sendDate: Joi.date().required(),
        //userId: Joi.ObjectId().required()
    }
    return Joi.validate(complain, schema)
}

function validateStatus(status) {
    const schema = {
        status: Joi.string().max(255).min(5).required(),
    }
    return Joi.validate(status, schema)
}
exports.Complain = complain;
exports.validate = validateComplain;
exports.validateStatus = validateStatus;