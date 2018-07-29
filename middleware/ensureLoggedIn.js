const express = require('express');
const router = express.Router();
const EnsureLoggedIn = function(req,res,next){
    if(!req.session.user){
        res.redirect('/login');
    }
    next();
}
module.exports = EnsureLoggedIn;