const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer")
const moment = require("moment")
const storage = multer.diskStorage({
  destination: function(req , file,cb){
    cb(null , "./public/uploads/")
  },
  filename: function(req , file , cb){
    cb(null , file.originalname)
  }
})
const upload = multer({ 
  storage : storage, 
  limits: {
     fileSize: 1024 * 1024 * 5
    }
  })
const decode = require("jwt-decode");
const { setToken } = require("../../auth/auth");
const { Checkout } = require("../../models/Admin/CheckOut");
const { Request } = require("../../models/User/Request");
const { Asset, validate } = require("../../models/Admin/Asset");
const router = express.Router();

router.post("/uploads" , upload.single("assetImage") , async (req , res)=>{
      res.send(req.file.originalname) 
  })

router.post("/add" ,async (req, res) => {
 const { body } = req;
  const { error } = validate(req.body);
  if (error){
     console.log(error.details[0].message)
     res.status(400).send(error.details[0].message);
  }
  let asset = await Asset.findOne({ title: req.body.title });
  if (asset) {
    console.log("Already Existed")
    res.status(404)
  }
  else {
    try{
    asset = new Asset({
      title: body.title,
      brand: body.brand,
      quantity: body.quantity,
      price: body.price,
      purchaseDate: new Date(body.purchaseDate),
      assetImage: body.assetImage,
      category: body.category
    });
    await asset.save();
    console.log("Asset Added Successfully!")
    res.send("Added Successfully")
  }
  catch(ex){
    res.status(400)
    }
  }
});

router.get("/view", async (req, res) => {
  const assets = await Asset.find();
  if(assets) res.send(assets);
  res.status(400)
});

router.get("/getAsset/:id", async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if(asset)
      res.send(asset);
  res.status(400)    
});

router.get("/view/assetTitles", async (req, res) => {
  const assets = await Asset.find().select({ title: 1 , category: 1});
  res.send(assets);
});

router.post("/assignAsset", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));
  let usersObj = {
    user_id: req.body.user_id,
    issueDate: req.body.issueDate,
    returnDate: req.body.returnDate,
  };
  try {
    const asset = await Asset.findOneAndUpdate(
      { title: req.body.assetTitle },
      { $push: { users: usersObj }, $inc: { quantity: -1 } }
    );

    res.send(asset);
    console.log("Asset Assigned successfully!!!");
    try {
      await Request.findOneAndDelete({ _id: req.body.Id });
      const checkout = new Checkout({
        user: req.body.user_id,
        assetTitle:req.body.assetTitle,
        issueDate: req.body.issueDate,
        returnDate:req.body.returnDate
      });
      await checkout.save();
      console.log("Checked Out successfully", checkout);
    } catch (ex) {
      console.log("Exception in Checkout", ex.message);
    }
  } catch (ex) {
    console.log("Exception in adding users", ex.message);
    res.status(400);
  }
});

router.get("/assetsReport/:month", async (req, res) => {
 // console.log("req params assets month" ,req.params.month)
  const assets = await  Asset.find();
  // console.log(assets)
  const result = assets.filter(date=>{
    console.log(date.purchaseDate)
    return moment(date.purchaseDate).format('MMMM') == req.params.month
  })
  if(result) res.send(result)
  res.status(400)
  // console.log("Requests" , result)      
})

router.get("/assetCount", async (req, res) => {
  const assetCount = await Asset.find().countDocuments();
  res.send(assetCount.toString());
});

router.post("/update", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error);
  const jwt = decode(req.header("x-auth-token"));
  let asset = await Asset.findById(jwt.id);
  if (!asset) res.status(404).send("Invalid Asset");
  else {
    asset.set({
      brand: req.body.brand,
      quantity: req.body.quantity,
      price: req.body.price,
      purchaseDate: req.body.purchaseDate,
    });
    const result = await asset.save();
    res.send(result);
  }
});

router.delete("/delete", async (req, res) => {
  const jwt = decode(req.header("x-auth-token"));

  const asset = await Asset.findByIdAndRemove(jwt.id);
  res.send("Successfully deleted");
});

module.exports = router;
