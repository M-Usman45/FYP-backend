const jwt = require("jsonwebtoken");

function setToken(id, email, isAdmin, isApproved) {
  return jwt.sign(
    {
      id: id,
      isAdmin: isAdmin,
      email: email,
      isApproved: isApproved,
    },
    "usman45"
  );
}

function loginauth() {}

exports.setToken = setToken;
