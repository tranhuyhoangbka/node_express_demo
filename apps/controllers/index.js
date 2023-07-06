var express = require("express");
var router = express.Router();
const {requireAuthenticate} = require('./user/passport');

router.use("/admin", require(__dirname + "/admin"));
router.use("/blog", require(__dirname + "/blog"));
router.use("/contact", require(__dirname + "/user/contact"));
router.use("/login", require(__dirname + "/user/sessions"));
router.use("/register", require(__dirname + "/user/registration"));

router.get("/", requireAuthenticate, function(req, res) {
  // res.json({"message": "this is home page"});
  res.render("home", {pageTitle: 'home', flashMessages: req.flash('success')});
});

module.exports = router;