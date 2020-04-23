const express = require('express');
const router =  express.Router();
const UUser = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// register page
router.get('/register', (req, res) => {
    res.render('register');
});


// handle register
router.post('/register', (req, res) =>{
    // destructure
    const { name, email, password, password2 } = req.body;

    // verification
    const errors = [];

    // check for required fields
    if(!name || !email || !password || !password2){
        errors.push({
            msg: "please input all fields !"
        });
       
    }

    // check password match
    if(password !== password2){
        errors.push({
            msg: "passwords d not match !"
        })
    }

    // check password length

    if(password.length < 6){
        errors.push({ msg: 'password weak enter more than 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email, 
            password,
            password2
        })
    }
    else{
        // pass
        UUser.findOne({email:email})
        .then(user => {
            if(user){
                errors.push({msg: 'email alraedy exists'});
                console.log(errors);
                res.render('register', {
                    errors,
                    name,
                    email, 
                    password,
                    password2
                }) 
            }else{
                const newUser = new  UUser({
                    name,
                    email,
                    password,
                });

                // hash passwords
                bcrypt.genSalt(10, (err, salt) =>
                   bcrypt.hash(newUser.password, salt , (err, hash) => {

                    if(err)throw err;

                    newUser.password = hash;

                    // save user
                    newUser.save()
                    .then( user => {
                        req.flash('success_msg', 'you registed now you can login');
                        res.redirect('login');
                    })
                    .catch(console.log(err));
                }))

                
                
            }
        })
    }
});

// login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'you logged out');
    res.redirect('/');
})


module.exports = router;