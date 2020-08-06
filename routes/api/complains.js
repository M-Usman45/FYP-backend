const mongoose = require("mongoose");
const express = require("express");
const decode = require("jwt-decode");
const { Complain, validate } = require("../../models/User/Complain");
const router = express.Router();

router.post("/send", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  complain = new Complain({
    title: req.body.title,
    description: req.body.description,
    status: "delivered",
    userId: jwt.id,
    sendDate: new Date(),
  });
  await complain.save();
  res.send(complain);
});

router.get("/userComplains", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  // console.log(jwt.id)
  const complains = await Complain.find({ userId: jwt.id });
  if (!complains) res.send("No compalin found");
  res.send(complains);
});

router.get("/complainsCount", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const count = await Complain.countDocuments({ userId: jwt.id });
  if (!count) res.status(400);
  console.log("Total user Complains", count);
  res.send(count.toString());
});

router.post("/edit/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.message);
  //const jwt = decode(req.header("x-auth-token"))
  const complain = await Complain.findById({ _id: req.params.id });
  if (!complain) res.send("Complain does not exixts").status(400);
  complain.set({
    title: req.body.title,
    description: req.body.description,
  });

  await complain.save();
  res.send(complain);
});

router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  const complain = await Complain.findById({ _id: req.params.id });
  if (!complain) res.send("Complain Deos not exists").status(400);
  await complain.remove();
  res.send("successfully deleted!");
});

module.exports = router;
