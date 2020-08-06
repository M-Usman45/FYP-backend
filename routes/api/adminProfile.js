const express = require('express');
const decode = require("jwt-decode")
const { Admin, validate } = require('../../models/Admin/Admin');

const router = express.Router();

router.get("/view", async (req, res) => {
    const jwt = decode(req.header(
        "x-auth-token"
    ))
    const admin = await Admin.findById(jwt.id)
    if (!admin)
        res
            .status(404)
            .send("Unauthorized Admin")

    else
        res.send(admin)

})
router.post("/edit", async (req, res) => {
    const { error } = validate(req.body)
    if (error)
        res.status(400).send(error)
    const jwt = decode(req.header(
        "x-auth-token"
    ))
    let admin = await Admin.findById(jwt.id)
    if (!admin)
        res
            .status(404)
            .send("Unauthorized Admin")
    else if (req.body.password === admin.password) {
        admin.set({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            contactno: req.body.contactno,
        })
        const result = await admin.save()
        res.send(result)
    }
    else {

        res.status(400).send("enter the correct password")

    }

})

router.post("/edit/changepassword", async (req, res) => {

    const jwt = decode(req.header(
        "x-auth-token"
    ))
    const admin = await Admin.findById(jwt.id)
    if (!admin) {
        res
            .status(404)
            .send("Unauthorized Admin")
    }
    else if (req.body.password === admin.password) {
        admin.password = req.body.newpassword
        await admin.save()
        res
            .send("Password is changed successfully!")
    }
    else
        res.send("Enter the correct password")
})

router.get("/logout", async (req, res) => {


})

module.exports = router