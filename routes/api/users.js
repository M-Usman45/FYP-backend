const express = require("express");
const router = express.Router();
const email = require("./email");
const bcrypt = require("bcryptjs");
const { User, validate, validateLogin } = require("../../models/User/User");
const { setToken } = require("../../auth/auth");
const { ResetPassword } = require("../../models/User/ResetPassword");
router.post("/signup", async (req, res) => {
  console.log(
    "signUp Backend ",
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
    req.body.department,
    req.body.contactno
  );
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
    console.log("validation Error", error);
    return res.status(400).send(error.details[0].message);
  }
  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log("user already exists");
    return res.status(400).send("User already exisits!");
  } else {
    // Insert the new user if they do not exist yet
    try {
      user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        department: req.body.department,
        contactno: req.body.contactno,
        isAdmin: false,
        isApproved: false,
      });
    } catch (ex) {
      console.log("Error in creating user", ex);
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = setToken(user._id, user.isApproved, user.email, user.isAdmin);
    console.log("token", token);
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token);
    console.log(user);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) res.status(400)
    try{
    const token = setToken(user._id, user.email, user.isAdmin, user.isApproved);
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token)
      .status(200)
    console.log(user);
    }
    catch(ex){
       console.log("Setting token Exception" , ex)
    }
  } else res.status(400);
});

router.put("/resetPassword1", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) res.send("Invalid Not Found");

  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(req.body.password, salt);

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        password: pass,
      },
    },
    { new: true }
  );
  const token = setToken(user._id, user.email, user.isAdmin);
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

router.put("/rp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log("in rp", user);
  if (!user)
    res.status(404).json({
      status: false,
    });
  else {
    const code = Math.floor(Math.random() * 10001) + 1111;
    const text =
      "Please enter the following code to reset your password " + code;
    try {
      email(req.body.email, "My Assst Reset password ", text);
      const rp = new ResetPassword({
        email: req.body.email,
        user_id: user._id,
        code: code,
      });
      await rp.save();
      res.send("The email has been sent to " + req.body.email);
    } catch (exp) {
      console.log("Error is sending email");
      console.log(exp);
      res.status(404).json({ msg: "Error in sending the email" });
    }
  }
});

router.put("/validateCodeViaEmail", async (req, res) => {
  const c = await ResetPassword.findOne({
    code: req.body.code,
    email: req.body.email,
  });
  if (c) {
    await ResetPassword.findByIdAndRemove(c._id);
    res.send("Code Verified");
  } else {
    res.status(404).send("Invalid Code");
  }
});

router.update;
module.exports = router;
