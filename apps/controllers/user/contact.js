var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
//   res.json({"message": "this is blog page"});
  res.render("user/contact", {contact: {title: 'title', content: 'cotnent', email: 'test@example.com'}, pageTitle: 'sample page title'});
});

module.exports = router;