const express = require('express');
const router = express.Router();
const EnsureLoggedIn = function(req,res,next){
    if(!req.session.user){
        res.redirect('/');
    }
    next();
}
module.exports = EnsureLoggedIn;