const express = require("express");
const { Category, validate } = require("../../models/Admin/Category");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  try{
  const category = new Category({
    name: req.body.name
  });
  await category.save();
  res.send("Category added successfully!");
  }
  catch(ex)
  {
    console.log("Category exception")
  }

});

router.get("/view", async (req, res) => {
  const category = await Category.find()
  if(!category)
     res.status(400)
   res.send(category);
});

module.exports = router;
