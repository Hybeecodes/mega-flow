var express = require('express');
var router = express.Router();
var app = require('../app');
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var multer = require('multer');
var users = db.get('users');
var bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
const passwoid = require('passwoid');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');

var sess;
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    // if(req.user){
    //     // var user = req.user;
    //     // console.log(user)
    //     // var user = req.user;
    //     res.render('users/dashboard', { title: 'Mega Flow - ',user:user});
    // }else{
    //     res.render('index', { title: 'Mega Flow',user:false});
    // }
    res.render('index', { title: 'Mega Flow',user:false});
});
router.get('/session',function(req,res,next){
    res.send('Hello ' + JSON.stringify(req.session));
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log(req.session);
        console.log('right to login');
        return next();
    }
    console.log('unauthorized user');
    res.redirect('/users/login');
}




module.exports = router;
