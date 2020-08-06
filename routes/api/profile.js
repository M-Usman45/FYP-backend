const express = require("express");
const decode = require("jwt-decode");
const { User, validate } = require("../../models/User/User");

const router = express.Router();

router.get("/view", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const user = await User.findById(jwt.id);
  if (!user) {
    res.status(404).send("Invalid User");
  } else res.send(user);
});
router.post("/edit", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error);
  const jwt = decode(req.header("x-auth-token"));
  let user = await User.findById(jwt.id);
  if (!user) res.status(404).send("Invalid User");
  else if (req.body.password === user.password) {
    user.set({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      department: req.body.department,
      contactno: req.body.contactno,
      password: req.body.password,
    });
    const result = await user.save();
    res.send(result);
  } else {
    res.status(400).send("enter the correct password");
  }
});

router.post("/edit/changepassword", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const user = await User.findById(jwt.id);
  if (!user) {
    res.status(404).send("Invalid User");
  } else if (req.body.password === user.password) {
    user.password = req.body.newpassword;
    await user.save();
    res.send("Password is changed successfully!");
  } else res.send("Enter the correct password");
});

router.get("/logout", async (req, res) => {});

module.exports = router;
