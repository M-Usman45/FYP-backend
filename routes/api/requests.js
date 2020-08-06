const mongoose = require("mongoose");
const express = require("express");
const decode = require("jwt-decode");
const { Request, validate } = require("../../models/User/Request");
const router = express.Router();

router.post("/send", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const { error } = validate(req.body);
  const date_obj = new Date();
  if (error) res.status(400).send(error.details[0].message);
  request = new Request({
    title: req.body.title,
    assetTitle: req.body.assetTitle,
    issueDate: req.body.issueDate,
    returnDate: req.body.returnDate,
    description: req.body.description,
    status: "delivered",
    userId: jwt.id,
    sendDate: date_obj,
    category: req.body.category
  });
  await request.save();
  res.send("Saved to the database successfully");
});

router.get("/userRequests", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  const requests = await Request.find({ userId: jwt.id });
  if (!requests) res.send("No request found");
  res.send(requests);
});

router.get("/requestsCount", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  const count = await Request.countDocuments({ userId: jwt.id });
  if (!count) res.status(400);
  console.log("Total user Requests", count);
  res.send(count.toString());
});
router.post("/edit/:id", async (req, res) => {
  console.log(req.params.id);
  const { error } = validate(req.body);
  if (error) res.send(error.message);
  //const jwt = decode(req.header("x-auth-token"))
  const request = await Request.findById({ _id: req.params.id });
  if (!request) res.send("Request does not exixts");
  request.set({
    title: req.body.title,
    assetTitle: req.body.assetTitle,
    issueDate: req.body.issueDate,
    returnDate: req.body.returnDate,
    description: req.body.description,
  });

  await request.save();
  res.send(request);
});

router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  const request = await Request.findById({ _id: req.params.id });
  if (!request) res.send("Request Deos not exists").status(400);
  await request.remove();
  res.send("successfully deleted!");
});

module.exports = router;
