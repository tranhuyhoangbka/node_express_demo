var express = require("express");
var router = express.Router();

const {User} = require('../../db/models');

router.get("/", async function(req, res) {
  const users = await User.findAll();
  console.log('all User: ', JSON.stringify(users, null, 2));
  res.json({"message": "this is admin page"});
});

module.exports = router;