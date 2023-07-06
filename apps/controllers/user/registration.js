var express = require("express");
var router = express.Router();
const {User} = require('../../../db/models');
const { genPassword } = require("./passport");
const { userExists } = require('./passport');

router.get('/', function(req, res) {
    res.render('user/register', {pageTitle: 'Register', flashErrorMessages: req.flash('error'), flashSuccessMessages: req.flash('success')});
});

router.post('/', userExists, async function(req, res, next) {
    console.log(req.body.password);
    const saltHash = genPassword(req.body.password);
    const { salt, hash } = saltHash;
    try {
        const user = await User.create({username: req.body.username, hash: hash, salt: salt, isAdmin: false});   
        console.log('success create user');
        req.flash('success', 'create user success');
        res.redirect('/login');
    } catch (error) {
        console.log('error: ', error);
        throw new Error('create user failed');
    }    

});

module.exports = router;