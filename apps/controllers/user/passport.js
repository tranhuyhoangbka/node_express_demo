const passport = require('passport');
const crypto = require('crypto');
const {User} = require('../../../db/models');

async function verifyCallback(username, password, done) {
    const user = await User.findOne({username: username});
    console.log('user', JSON.stringify(user, null, 2));
    if (user ===  null) {
        return done(null, false, {message: 'not found user'});
    }
    const isValid = validPassword(password, user.hash, user.salt);
    userInfo = {id: user.id, username: user.username, hash: user.hash, salt: user.salt};
    if(isValid) {
        return done(null, userInfo);
    } else {
        return done(null, false, {message: 'invalid password'});
    }
}

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash == hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return {salt: salt, hash: genhash};
}

function isAuth(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/notAuthorized');
    }
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    } else {
        res.redirect('/notAuthorizedAdmin');
    }
}

async function userExists(req, res, next) {
    const user = await User.findOne({where: {username: req.body.uname}});
    if(user === null) {
        next();
    } else {    
        res.redirect('/userAlreadyExists');
    }
}

module.exports = {verifyCallback, genPassword}