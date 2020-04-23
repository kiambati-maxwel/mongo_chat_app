const express = require('express');
const router =  express.Router();
const { ensureAuthenticated }  = require('../config/auth');


router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        userName: req.user.name
    });
    const userName = req.user.name;
    console.log(userName);
});

module.exports = router;
