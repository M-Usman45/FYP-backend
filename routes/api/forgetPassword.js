const express = require("express")
const router = express.Router()
const mailsender = require("mailsender")
const { User } = require('../../models/User/User');

router.post("/user", async (req, res) => {

    const user = User.findOne()

})