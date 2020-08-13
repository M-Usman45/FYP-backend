const express = require("express");
const decode = require("jwt-decode");
const { Request } = require("../../models/User/Request");
const moment = require("moment")
const router = express.Router();

router.get("/view", async (req, res) => {
  const requests = await Request.find({
    // $or: [
    //   { status: "delivered" },
    //   { status: "pending" },
    //   { status: "In proccees" },
    //   { status: "In proccees" },
    //   { status: "rejected" },
    //   { status: "Pending" },
    // ],
  }).populate("userId", "firstname lastname email _id");
  res.send(requests);
});

router.get("/view/:id", async (req, res) => {
 // console.log(req.params.id);
  const request = await Request.findById(req.params.id)
    .populate("userId", "firstname lastname email department _id ")
    .select();
  res.send(request);
  //  console.log(request);
  if (!request) console.log("Connot found");
});

router.get("/requestCount", async (req, res) => {
  const reqCount = await Request.countDocuments({
    $or: [
      { status: "delivered" },
      { status: "pending" },
      { status: "In proccees" },
      { status: "In proccees" },
      { status: "rejected" },
      { status: "Pending" },
    ],
  });
  res.send(reqCount.toString());
});

router.get("/requestsReport/:month", async (req, res) => {
  console.log("params month" , req.params.month)
  const requests = await  Request.find().populate("userId", "firstname lastname email _id");
  const result = requests.filter(date=>{
    console.log("Moment month" ,  moment(date.sendDate).format('MM'))
   return moment(date.sendDate).format('MM') == req.params.month
  })
  console.log("Request Reports",result)
  if(result) res.send(result)
  res.status(400)
})

router.get("/pendingRequestsCount", async (req, res) => {
  const pendingReq = await Request.countDocuments({ status: "pending" });
  res.send(pendingReq.toString());
});

router.post("/updateStatus/:id", async (req, res) => {
  //console.log("Request status", req.body.status);
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    );
    res.send(request);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

router.delete("/remove", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  await Request.findOneAndRemove(jwt.id);
  res.send("Successfully removed");
});

module.exports = router;
