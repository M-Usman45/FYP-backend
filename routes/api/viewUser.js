const express = require("express");
const decode = require("jwt-decode");
const { User } = require("../../models/User/User");

const router = express.Router();

router.get("/viewUsers", async (req, res) => {
  const user = await User.find({
    $and: [{ isAdmin: false }, { isApproved: true }],
  });
  if (user) res.send(user);
  else res.send("No Registered Users");
});

router.get("/userCount", async (req, res) => {
  const user = await User.countDocuments({ isAdmin: "false" });
  //console.log(user)
  res.send(user.toString());
});

router.get("/approve/:id", async (req, res) => {
  console.log("Approve User Backend", req.params.id);
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isApproved: true } }
  );
  res.send(user);
  console.log("User found", user);
});

router.get("/usersRequest", async (req, res) => {
  const user = await User.find({ isApproved: false });
  if (user) {
    res.send(user);
  } else res.status(404).send("User not fount");
});

router.get("/getUser/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.send(err);
  }
});

router.post("/editProfile/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id , 
  {firstname: req.body.fname}, {lastname: req.body.lname }, {contactno: req.body.contact} ,
  (err , docs)=>{
      if(err)
         res.status(400).send(err) 
      res.send(docs)                                    
  });

});

router.get("/events/view", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const user = await User.findById(jwt.id);
  if (user) {
    res.send(user.events);
  } else {
    res.send(err);
  }
});

router.post("/events/add", async (req, res) => {
  let event = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    url: req.body.url,
  };
  const jwt = decode(req.header("x-auth-token"));
  const user = await User.findById(jwt.id);
  if (user) {
    user.events.push(event);
    await user.save();
    res.send(user);
  } else {
    res.send(err);
  }
});

router.delete("/remove", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  await User.findOneAndRemove(jwt.id);
  res.send("Successfully removed");
});

module.exports = router;
