const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const UserHandler = require('../handlers/UserHandler');
const EnsureLoggedIn = require('../middleware/ensureLoggedIn');
const passport = require('../config/passport');
const sendMail = require('../middleware/mail');
const passwoid = require('passwoid');
const bcrypt = require('bcrypt-nodejs');

module.exports.getIndex = (req,res,next)=>{
    res.redirect('/users/dashboard');
}


module.exports.getDashboard = (req,res,next)=>{
    res.render('users/dashboard',{title:'MegaSlack - dashboard',user:req.session.user,name:'dashboard'});
}

module.exports.updateProfile =  (req,res,next)=>{
    UserHandler.updateUserProfile(req,res).then((result)=>{
        res.json({status:1,message:"Profile Updated Successfully!"});
    }).catch((err)=>{
        res.json({status:0,message:"Sorry, Unable to Update Status!"+err});
    });
}

module.exports.getProfile = (req,res,next)=>{
    UserHandler.getUserById(req.session.user._id).then(user=>{
        res.render('users/profile',{user:user,title:'MegaFlow - profile', name:'profile'});
    }).catch(err=>{
        res.redirect('/users/dashboard');
    });
}


module.exports.getChangePass = (req,res,next)=>{
    res.render('users/change_password',{title:'Mega Flow - Change Password',name:'changePass',errors:req.session.errors});
    req.session.errors = null;
}

module.exports.changeUserPass = (req,res)=>{
    req.checkBody('password1','please enter your old password').notEmpty();
  req.checkBody('password2','please enter your new password').notEmpty();
  req.checkBody('password3','Please confirm your new password').equals(req.body.password2);

  req.getValidationResult().then((errors)=>{

    if(!errors.isEmpty()){
    //   console.log(result.array())
        req.session.errors = errors;
        req.session.success = false;
      req.redirect('/users/change_password');

    }else{
      var password = bcrypt.hashSync(req.body.password2);
      UserHandler.changeUserPass(req.session.user._id,req.session.user.email,password).then((result)=>{
        // send mail
            const subject = "Password Change";
            const text = `Your password was changed successfully. <br> Here is your new password: <b>${req.body.password2}</b>`;
            const to = req.session.user.email;
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
          res.redirect('/users/change_password');
      })
    }
  });
}


module.exports.logout = (req,res)=>{
    req.session.user = null;
  res.redirect('/login');
}



