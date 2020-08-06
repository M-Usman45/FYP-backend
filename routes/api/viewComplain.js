const express = require("express");
const decode = require("jwt-decode");
const { Complain, validateStatus } = require("../../models/User/Complain");

const router = express.Router();

router.get("/view", async (req, res) => {
  const complains = await Complain.find({
    $or: [
      { status: "delivered" },
      { status: "pending" },
      { status: "In proccees" },
      { status: "In proccees" },
      { status: "rejected" },
      { status: "Pending" },
    ],
  }).populate("userId", "firstname lastname _id");

  res.send(complains);
});

router.get("/complainsCount", async (req, res) => {
  const compCount = await Complain.countDocuments({
    $or: [
      { status: "delivered" },
      { status: "pending" },
      { status: "In proccees" },
      { status: "In proccees" },
      { status: "rejected" },
      { status: "Pending" },
    ],
  });
  res.send(compCount.toString());
});

router.get("/pendingComplains", async (req, res) => {
  const pendingComp = await Complain.countDocuments({ status: "pending" });
  res.send(pendingComp.toString());
});

router.get("/view/:id", async (req, res) => {
  console.log(req.params.id);
  const complain = await Complain.findById(req.params.id)
    .populate("userId", "firstname lastname email department _id ")
    .select();
  res.send(complain);
  console.log(complain);
  if (!complain) console.log("Connot found");
});

router.get("/getInfo/:id", async (req, res) => {
  console.log(req.params.id);
  const complain = await Complain.findById(req.params.id).select({
    title: 1,
    description: 1,
    _id: -1,
  });
  res.send(complain);
  console.log(complain);
  if (!complain) console.log("Connot found");
});

router.post("/updateStatus/:id", async (req, res) => {
  console.log("complains status", req.body.status);
  try {
    const complains = await Complain.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    );
    res.send(complains);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});
router.delete("/remove", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  await Complain.findOneAndRemove(jwt.id);
  res.send("Successfully removed");
});

module.exports = router;
