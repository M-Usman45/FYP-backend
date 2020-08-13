const express = require("express");
const { CheckIn } = require("../../models/Admin/CheckIn");
const {Asset }  = require("../../models/Admin/Asset")
const router = express.Router();

router.get("/view", async (req, res) => {
  const checkIns = await CheckIn.find()
    .populate("user", "firstname lastname email department")
    .populate("asset", "title brand");
  if (!checkIns) res.send("No compalin found");
  res.send(checkIns);
});

router.post("/checked/:id", async (req, res) => {
  console.log("checked in")
  const asset = Asset.findOneAndUpdate({title:req.body.title}
      ,{$inc:{quantity:1}},
       function (result , error ){
          if(error) {
            console.log("Asset Update error" , error.message)
            res.status(400)
          }
       res.send(result)  
     } )
       const checkIns = await CheckIn.findByIdAndDelete({_id: req.params.id})
  if (!checkIns) res.send("No compalin found");
  res.send(checkIns);
});


module.exports = router;
