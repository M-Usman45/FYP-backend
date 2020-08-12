const express = require("express");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const admin = require("./routes/api/admins");
const profile = require("./routes/api/profile");
const assets = require("./routes/api/assets");
const requests = require("./routes/api/requests");
const complains = require("./routes/api/complains");
const viewUser = require("./routes/api/viewUser");
const anouncements = require("./routes/api/anouncements");
const categories = require("./routes/api/categories");
const viewAdmin = require("./routes/api/viewAdmin");
const adminProfile = require("./routes/api/adminProfile");
const viewRequests = require("./routes/api/viewRequest");
const viewComplains = require("./routes/api/viewComplain");
const UsersAsset = require("./routes/api/UsersAsset");
const checkIns = require("./routes/api/checkIns");
const checkOuts = require("./routes/api/checkOuts");

const cors = require("cors");
const app = express();
connectDB();
app.use(cors());
app.use("/public/uploads" , express.static('public/uploads'))
app.use(express.json());
app.use("/api/user", users);
app.use("/api/admin", admin);
app.use("/api/admin/admins", viewAdmin);
app.use("/api/admin/assets", assets);
app.use("/api/user/profile", profile);
app.use("/api/admin/users", viewUser);
app.use("/api/user/requests", requests);
app.use("/api/user/complains", complains);
app.use("/api/admin/profile", adminProfile);
app.use("/api/admin/requests", viewRequests);
app.use("/api/admin/complains", viewComplains);
app.use("/api/admin/anouncements", anouncements);
app.use("/api/admin/categories", categories);
app.use("/api/user/assets", UsersAsset);
app.use("/api/admin/checkIns", checkIns);
app.use("/api/admin/checkOuts", checkOuts);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
