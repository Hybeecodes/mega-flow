const express = require('express');
const router = express.Router();
const EnsureLoggedIn = function(req,res,next){
    if(!req.user){
        res.redirect('/');
    }
    next();
}
module.exports = EnsureLoggedIn;