const express = require("express");
const decode = require("jwt-decode");
//const { Admin, validate } = require('../../models/Admin/Admin');
const { User } = require("../../models/User/User");

const router = express.Router();

router.get("/viewAdmins", async (req, res) => {
  const user = await User.find({ isAdmin: true }).select({
    firstname: 1,
    lastname: 1,
    email: 1,
    department: 1,
    contactno: 1,
    isApproved: 1,
  });
  if (user) res.send(user);
  else res.send("No Registered Admin Exists");
});

router.get("/adminInfo/:id", async (req, res) => {
  console.log("Admin Info Backend", req.params.id);
  const admin = await User.findById(req.params.id).select({
    firstname: 1,
    lastname: 1,
    email: 1,
    department: 1,
    contactno: 1,
    isAdmin: 1,
  });
  res.send(admin);
});

router.get("/adminCount", async (req, res) => {
  const adminCount = await User.countDocuments({ isAdmin: "true" });
  res.send(adminCount.toString());
});

router.get("/approve", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const admin = await User.findById(jwt.id);
  if (admin) {
    admin.set({
      isAdmin: true,
    });
    admin.save();
    res.send(admin);
  } else res.status(404).send("Admin not fount");
});

router.delete("/removeAdmin/:id", async (req, res) => {
  const _id = req.params.id;
  console.log("Remove Admin backend", _id);
  const admin = await User.findById(_id);
  if (!admin.isApproved) {
    await admin.remove();
    res.send("Successfully removed");
  } else res.send("Admin cannot be deleted!");
});

module.exports = router;
