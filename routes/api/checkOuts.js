const express = require("express");
const { Checkout } = require("../../models/Admin/CheckOut");
const moment = require("moment")
const router = express.Router();

router.get("/view", async (req, res) => {
  
  //const today = moment()
  //console.log(today)
  //const monthAgo= moment().subtract(30 , 'days')
 // console.log("Date month ago" , monthAgo)
  // const checkout = await Checkout.find({ issuDate: {$lte: new Date(monthAgo ) } })

  const checkout = await Checkout.find()
    .populate("user", "firstname lastname email department")

  if (!checkout) res.send("No checkOut found");
  res.send(checkout);
  console.log(checkout)
});

module.exports = router;
