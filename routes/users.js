var express = require('express');
var router = express.Router();
var app = require('../app');
const mongo = require('mongodb');
// var db = require('monk')('mongodb://mega:mega@ds147034.mlab.com:47034/mega-flow');
require('../config/db_config');
// var db = require('monk')('localhost/megaflow');
var multer = require('multer');
var users = require('../models/User');
var userInfo = require('../models/UserInfo');
var bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const passport = require('../config/passport');
// var LocalStrategy = require('passport-local').Strategy;
const passwoid = require('passwoid');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');
const EnsureLoggedIn = require('../middleware/ensureLoggedIn');
const UserController = require('../controllers/UserController');


// var csrfProtection = csrf({ cookie: true });
//  router.use(csrfProtection);


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: app.Email_User,
    pass: app.Email_Password
  }
});




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage })

/* GET users listing. */
router.get('/',UserController.getIndex);

router.get('/dashboard',UserController.getDashboard);

router.get('/login',UserController.getLogin);

router.post('/profile',UserController.updateProfile);

router.get('/profile',UserController.getProfile);

router.post('/login',UserController.authenticateUser);

router.get('/logout',UserController.logout);


router.get('/register',UserController.getRegister);

router.post('/register',UserController.registerUser);

router.get('/reset_password',function(req,res,next){
  res.render('users/reset_password',{title:'Mega Flow - Reset Password',errors:false, success:false});
})

//forgot password
router.post('/reset_password',function(req,res,next){

  // verify email
  req.checkBody('email','email is required').notEmpty();
  req.checkBody('email','Enter a valid email').isEmail();

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render('users/reset_password',{title:'Mega Flow - Reset Password',errors:result.array() ,success:false});
    }else{
      var email = req.body.email;
      var newPass = passwoid(10);
      console.log(newPass);
      var password = bcrypt.hashSync(newPass);
      users.update({email: email}, {$set:{password:password}},function(err,result){
        if(err) throw err;
        
        var mailOptions = {
          from: 'My Catalogue ',
          to: email,
          subject:'Password Reset',
          text:'Your new password is : '+newPass
        };
  
        transporter.sendMail(mailOptions,function(err,info){
          if(err){
            console.log(err);
          }else{
            console.log('Email Sent');
            res.render('users/reset_password',{title:'Mega Flow - Reset Password',errors:false, success:true});
          }
        })
      })
    }
  });

});

//change password
router.get('/change_password',function(req,res,next){
  res.render('users/change_password',{title:'Mega Flow - Change Password',name:'changePass',errors:false});
});

router.post('/change_password',function(req,res,next){

  // validate inputs
  req.checkBody('password1','please enter your old password').notEmpty();
  req.checkBody('password2','please enter your new password').notEmpty();
  req.checkBody('password3','Please confirm your new password').equals(req.body.password2);

 
  req.getValidationResult().then(function(result){

    if(!result.isEmpty()){
      console.log(result.array())
      res.render('users/change_password',{title:'Mega Flow - Change Password',errors:result.array(),success:false,name:'changePass'});

    }else{
      var password = bcrypt.hashSync(req.body.password2);
      users.update({email: req.user.email}, {$set:{password:password}},function(err,result){
        if(err){
          console.log('error updating user password');
        }
        else{
          res.render('users/change_password',{title:'Mega Flow - Change Password',errors:false,success:true,name:'changePass'});
        }
      })
    }
  })
  
})
// get user profile by id
router.get('/profile/:id',function(req,res,next){
  users.findOne({_id:req.params.id},function(err,user){
    if(err) throw err;
    res.json(user);
  })
});

module.exports = router;
