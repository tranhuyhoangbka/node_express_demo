var express = require("express");
const nodemailer = require('nodemailer');
var router = express.Router();
const config = require('config');
const {requireAuthenticate} = require('./passport');

const {Contact} = require('../../../db/models');

router.get("/", requireAuthenticate, function(req, res) {
//   res.json({"message": "this is blog page"});
  res.render("user/contact", {contact: {title: 'title', content: 'cotnent', email: 'test@example.com'}, pageTitle: 'sample page title', flashMessages: req.flash('success')});
});

router.post("/", async function(req, res) {
  // Todo: save data to db
  console.log('rq', req.body)
  try {
    await Contact.create({subject: req.body.title, content: req.body.content, mail_to: req.body.email });
  } catch (error) {
    console.log('error:', error);
    return;
  }

  // Send mail
  // Set up nodemailer transporter with environment-specific configuration
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.username,
      pass: config.email.password
    }
  });

  // Email options
  const mailOptions = {
    from: config.email.from,
    to: 'test@example.com',
    subject: 'Subject of your email',
    html: '<p>Body of your email</p>'
  };

  // Send email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'create contact success');
      res.redirect("/contact");
    }
  });

  
});

module.exports = router;