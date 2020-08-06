const express = require("express");
const { setToken } = require("../../auth/auth");
const { Anouncement, validate } = require("../../models/Admin/Anouncement");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  let anounce = new Anouncement({
    title: req.body.title,
    description: req.body.description,
  });
  await anounce.save();
  res.send("Added successfully!");
});

router.get("/view", async (req, res) => {
  const anounce = await Anouncement.find().sort({ date: 1 });
  res.send(anounce);
});

router.get("/count", async (req, res) => {
  const anounce = await Anouncement.countDocuments();
  res.send(anounce.toString());
});

router.delete("/remove/:id", async (req, res) => {
  await Anouncement.findOneAndRemove(req.params.id);
  res.send("Successfully removed");
});

module.exports = router;
