var express = require('express');
var router = express.Router();
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const UserHandler = require('../handlers/UserHandler');
const uploadFile = require('../middleware/multer');
const EnsureLoggedIn = require('../middleware/ensureLoggedIn');
const passport = require('../config/passport');
const sendMail = require('../middleware/mail');

module.exports.getIndex = EnsureLoggedIn,(req,res,next)=>{
    res.redirect('/users/dashboard');
}

module.exports.getLogin = (req,res)=>{
    res.render('users/login',{title:'Mega Flow - Login'});
}

module.exports.getDashboard = EnsureLoggedIn,(req,res,next)=>{
    res.render('users/dashboard',{title:'MegaSlack - dashboard',user:req.user,name:'dashboard'});
    next();
}

module.exports.updateProfile = EnsureLoggedIn,uploadFile.single('photo'), (req,res,next)=>{
    UserHandler.updateUserProfile(req,res).then((result)=>{
        res.redirect('/users/profile');
    }).catch((err)=>{
        res.redirect('/users/profile');
    });
}

module.exports.getProfile = EnsureLoggedIn,(req,res,next)=>{
    UserHandler.getUserById(req.user._id).then(user=>{
        res.render('users/profile',{user:user,title:'MegaFlow - profile', name:'profile'});
    }).catch(err=>{
        res.redirect('/users/dashboard');
    });
}

module.exports.authenticateUser = passport.authenticate('local',{
    failureRedirect:'/users/login',
    failureFlash:'Invalid username or password'
  }),(req,res,next)=>{
    // console.log('inside')
    req.flash('success','You are logged in');
    var user = req.user;
    res.redirect('/users/dashboard'); 
}

module.exports.getRegister = (req,res,next)=>{
    res.render('users/register',{title:'Mega Flow - Register',success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
}

module.exports.registerUser = uploadFile.single('photo'),(req,res,next)=>{
    req.checkBody('firstname','firstname is required').notEmpty();
    req.checkBody('lastname','lastname is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    // req.checkBody('password2','passwords must be the same').equals(req.body.password);
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','Enter a valid email').isEmail();
    req.checkBody('username','username is required').notEmpty();
    req.getValidationResult().then((errors)=>{
        if(errors){
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/users/register');
        }else{
            if(UserHandler.checkUserByUsername(req.body.username)){
                var errors = [
                    {
                      msg:'Username Already exists '
                    }
                  ];
                  res.redirect('/users/register');
            }else{
                if(UserHandler.checkUserByEmail(req.body.email)){
                    var errors = [
                        {
                          msg:'Email Already exists '
                        }
                      ];
                      res.redirect('/users/register');
                }else{
                    UserHandler.addNewUser(req.body).then((user)=>{
                        // send email
                        const subject = "Confirmation Email";
                        const text = `Your registration was successful.<br> Your username is ${req.body.username}.<br> Enjoy your time with us.`;
                        const to = req.body.email;
                        sendMail(subject,text,to).then((info)=>{
                            res.redirect('/users/login');
                        }).catch((err)=>{
                            console.log(err);
                        });
                    }).catch((err)=>{
                        var errors = [
                            {
                              msg:'Sorry, an error occured '
                            }
                          ];
                          res.redirect('users/register');
                    });
                }
            }
        }
        
    });
}


module.exports.logout = (req,res)=>{
    req.logout();
  res.redirect('/users/login');
}



