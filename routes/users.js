// Todo 15-2 users.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
    res.render('login');
});


router.post('/register', (req, res) => {
    // const newUser = {
    //     name : req.body.name,
    //     email : req.body.email,
    //     username : req.body.username,
    //     password : req.body.password,
    //     password2 : req.body.password2,
    // };
    // res.send(newUser)

    // We are getting form input values
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    // we're gonna do validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Name is required').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        })
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser,(err,user)=>{
            if(err){
                throw err;
            }
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }


});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(!user){
                return done(null,false,{message:'Unknown User'})
            }
            User.comparePassword(password,user.password,function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done (null,user);
                }else{
                    return done(null,false,{message:'Invalid Password'});
                }
            })
        });
    }
));
// We have to Create that 2 Functions in User Model
// 1-  getUserByUsername
// 2-  comparePassword


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});



// I copied from pasport documentation
router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    });


router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});



module.exports = router;