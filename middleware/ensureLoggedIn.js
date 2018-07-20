const express = require('express');
const router = express.Router();
const EnsureLoggedIn = function(req,res,next){
    console.log('hello')
    if(!req.user){
        res.redirect('/');
    }
    next();
}
module.exports = EnsureLoggedIn;