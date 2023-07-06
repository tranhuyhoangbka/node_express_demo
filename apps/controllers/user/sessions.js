var express = require("express");
const passport = require("passport");
var router = express.Router();
const {User} = require('../../../db/models');

router.get("/", function(req, res) {
//   console.log(JSON.stringify(req.flash("error"), null, 2))
  res.render("user/login", {pageTitle: 'Login page', flashErrorMessages: req.flash('error'), flashSuccessMessages: req.flash('success')});
});

router.post("/", function(req, res, next) {
    console.log('user', req.user);
    const redirect_url = req.session.originalUrl;
    passport.authenticate('local', {failureRedirect: '/login', successRedirect: redirect_url, failureFlash: true, failureFlash: 'Invalid username or passwerd.'})(req, res, next);
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