const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "myassetpk@gmail.com",
    pass: "*Pakistan*",
  },
});

module.exports = function sendEmail(to, subject, text) {
  var mailOptions = {
    from: "MuhammadUsmanAmeer45@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };
  console.log("In sendEMail", mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};
