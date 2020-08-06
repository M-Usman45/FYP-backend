const express = require("express");
const decode = require("jwt-decode");
const { Asset } = require("../../models/Admin/Asset");
const { CheckIn } = require("../../models/Admin/CheckIn");
const { User } = require("../../models/User/User");
const router = express.Router();

router.post("/findAsset", async (req, res) => {
  const assets = await Asset.findOne({ title: req.body.title });
  res.send(assets);
});

router.get("/InUsedAssets/return/:id", async (req, res) => {
  console.log("Return In Used Asset");
  const jwt = decode(req.header("x-auth-token"));
  const userId = jwt.id;
  console.log(userId);
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { $pull: { users: { user_id: userId } } },
      { safe: true, upsert: true },
      function (res, err) {
        if (!err) {
          console.log("True");
        } else console.log("Error");
      }
    );
    // const update = await Asset.findOneAndUpdate(
    //   { _id: req.params.id },
    //   { $inc: { quantity: -1 } },
    //   { safe: true, upsert: true },
    //   function (res, err) {
    //     if (!err) {
    //       console.log("Quantity Updated successfully");
    //     } else console.log("Error");
    //   }
    // );
    // console.log("Updated Successfully");
    // //console.log(asset);
    try {
      const user = await User.findById(userId);
      const checkIn = new CheckIn({
        user: user._id,
        asset: asset._id,
        returnDate: Date.now()
      });
      await checkIn.save();
      res.send(checkIn);
      console.log("In Rertuen Asset Check In", checkIn);
    } catch (ex) {
      console.log(" CheckIn exception", ex.message);
    }
  } catch (ex) {
    console.log("error is updation", ex);
  }
});

router.get("/organizationAssets/view", async (req, res) => {
  const assets = await Asset.find().select({
    _id: 1,
    title: 1,
    brand: 1,
    quantity: 1,
  });
  res.send(assets);
});

router.get("/getAsset/:Title", async (req, res) => {
  // const assets = await Asset.find()
  // res.send(assets);
  console.log("in getAsset", req.params.Title);
});

router.get("/InUsedAssets/view", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  console.log("Issue Asset Users Id", jwt.id);
  const assets = await Asset.find({ "users.user_id": jwt.id });
  if (assets) res.send(assets);
  else res.send("Assets Not available");
});

router.get("/InUsedAssets/count", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  const assets = await Asset.find({ "users.user_id": jwt.id }).countDocuments();
  if (assets) {
    console.log("Total User Assets", assets);
    res.send(assets.toString());
  } else res.status(400);
});

module.exports = router;
