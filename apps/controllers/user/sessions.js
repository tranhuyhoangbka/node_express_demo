var express = require("express");
const passport = require("passport");
var router = express.Router();
const {User} = require('../../../db/models');

router.get("/", function(req, res) {
  res.render("user/login", {pageTitle: 'Login page', flashMessages: req.flash('success')});
});

router.post("/", passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/'}), function(req, res) {
    console.log('user', req.user);
});

router.get("/logout", function(req, res, next) {
        req.logout(function(err) {
            if (err) {
                return next(err)
            } else {
                res.redirect('/login')
            }
        })
        
});

module.exports = router;