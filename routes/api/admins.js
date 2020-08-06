const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")
const { User, validateAdmin, validateLogin } = require('../../models/User/User');
const { setToken } = require("../../auth/auth")

router.post('/register', async (req, res) => {
    // First Validate The Request
    const { error } = validateAdmin(req.body);
    if (error) {
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message);
    }
    // Check if this User already exisits
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.email,
            department: req.body.department,
            contactno: "09200000000",
            isAdmin: true,
            isApproved: false
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = setToken(user._id, user.email, user.isAdmin, user.isApproved)
        res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .send(token)

    }
    else
        res.send("Already exixting!")
});


router.post("/login", async (req, res) => {


    const { error } = validateLogin(req.body)

    if (error) {
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message)
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const validatePassword = bcrypt.compare(req.body.password, user.password)
        if (!validatePassword)
            res.status().send("Invalid email and password")
        const token = setToken(user._id, user.email, user.isAdmin, user.isApproved)
        res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .send(token)

    }
    else
        res.status(400).send("No Registered Admin exists")

})

router.update
module.exports = router;