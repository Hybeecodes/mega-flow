const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const UserHandler = require('../handlers/UserHandler');
const passport = require('../config/passport');
const sendMail = require('../middleware/mail');
const passwoid = require('passwoid');
const bcrypt = require('bcrypt-nodejs');


module.exports.getLogin = (req,res)=>{
    res.render('login',{title:'Mega Flow - Login'});
}

module.exports.authenticateUser = (req,res,next)=>{
   
    const username = req.body.username;
    const password = req.body.password;
    if(!UserHandler.validateData(password,username)){
        res.json({status:0,message:"Please fill all fields!"});
        return;
    }
        UserHandler.getUserByLogin(username,password).then((user)=>{
            req.session.user = user;
            res.json({status:1,message:"Login Successful, we are redirecting you..."});
            return;
        }).catch((err)=>{
            res.json({status:0,message:"Invalid Login Details"});
            return;
        });

}

module.exports.getRegister = (req,res,next)=>{
    console.log(req.session.errors);
    res.render('register',{title:'Mega Flow - Register',success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
}

module.exports.register = (req,res)=>{
    // backend validation
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const password2 = req.body.password2;
    const email = req.body.email;
    const username = req.body.username;
    if(!UserHandler.validateData(firstname,lastname,password,password2,email,username)){
        res.json({status:0,message:"Please fill all fields!"});
        return;
    }

    if(UserHandler.checkUserByEmail(email)){
        res.json({status:0,message:"Email exists Already"});
        return;
    }    // check if username exists
    else if (UserHandler.checkUserByUsername(username)){
        res.json({status:0,message:"Username exists Already"});
        return;
    }else{
        const newUser = {

        };
        UserHandler.addNewUser(req.body).then((user)=>{
            res.json({status:1,message:"Registration Successful"});
        }).catch((err)=>{
            res.json({status:0,message:"Sorry,An erorr occured"});
        })
    }
}

module.exports.registerUser = (req,res,next)=>{
    console.log(req)
    res.send("something");
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
            res.redirect('/register');
        }else{
            if(UserHandler.checkUserByUsername(req.body.username)){
                var errors = [
                    {
                      msg:'Username Already exists '
                    }
                  ];
                  res.redirect('/register');
            }else{
                if(UserHandler.checkUserByEmail(req.body.email)){
                    var errors = [
                        {
                          msg:'Email Already exists '
                        }
                      ];
                      res.redirect('/register');
                }else{
                    UserHandler.addNewUser(req.body).then((user)=>{
                        // send email
                        const subject = "Confirmation Email";
                        const text = `Your registration was successful.<br> Your username is ${req.body.username}.<br> Enjoy your time with us.`;
                        const to = req.body.email;
                        sendMail(subject,text,to).then((info)=>{
                            res.redirect('/login');
                        }).catch((err)=>{
                            console.log(err);
                        });
                    }).catch((err)=>{
                        var errors = [
                            {
                              msg:'Sorry, an error occured '
                            }
                          ];
                          res.redirect('/register');
                    });
                }
            }
        }
        
    });
}

module.exports.getResetPass = (req,res,next)=>{
    res.render('users/reset_password',{title:'Mega Flow - Reset Password',errors:req.session.errors,success:req.session.success});
    req.session.errors = null;
}

module.exports.resetUserPass = (req,res,next)=>{
    // verify email
  req.checkBody('email','email is required').notEmpty();
  req.checkBody('email','Enter a valid email').isEmail();
  // get errors
  req.getValidationResult().then((errors)=>{
      if(!errors.isEmpty()){
          req.session.errors = errors;
          req.session.success = false;
      }else{
          const email = req.body.email;
          // generate new password
          const newPass= passwoid(8);
          const newPassHash =bcrypt.hashSync(newPass);
          // update password
          UserHandler.changeUserPass(req.user._id,email,newPassHash).then((result)=>{
              // send email
              const subject = "Password Reset";
              const text = `Your password was reset successfully. <br> Here is your new password: <b>${newPass}</b>`;
              const to = req.body.email;
              sendMail(subject,text,to).then((info)=>{
                  res.redirect('/users/login');
              }).catch((err)=>{
                  console.log(err);
              });  
          }).catch((err)=>{
            var errors = [
                {
                  msg:'Sorry, an error occcured.'
                }
              ];
              res.redirect('/users/reset_password');
          });
        
      }
  });
}