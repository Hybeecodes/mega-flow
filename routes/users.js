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

var csrfProtection = csrf({ cookie: true });
// router.use(csrfProtection);



var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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


passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  users.findOne({_id:id}, function (err, user) {
    done(err, user);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login',function(req,res,next){
  res.render('users/login',{title:'Mega Flow - Login',errors:false});
});

passport.use(new LocalStrategy(
  function(username,password,done){
    users.findOne({username:username},function(err,user){
      if(err) throw err;
      if(!user){
        console.log('Unknown user');
        return done(null,false,{message:'Unknown User'});
      }
      if(!bcrypt.compareSync(password,user.password)){
        console.log('Invalid password');
        return done(null,false,{message:'Invalid Password'});
      }else{
        return done(null,user);
      }
    })

}))

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'}),
function(req,res,next){
  console.log('Authentication successful');
  req.flash('success','You are logged in');
  res.redirect('/');
});
router.get('/logout',function(req,res,next){
  req.logout;
  console.log('user logged out');
  req.flash('success','You have been logged out');
  res.redirect('/users/login');
})


router.get('/register',function(req,res,next){
  res.render('users/register',{title:'Mega Flow - Register',errors:false,success:false});
});
https://www.linuxmint.com/start/rebecca/


router.post('/register',upload.single('photo'),function(req,res,next){

  //validate inputs
  req.checkBody('firstname','firstname is required').notEmpty();
  req.checkBody('lastname','lastname is required').notEmpty();
  req.checkBody('password','password is required').notEmpty();
  req.checkBody('password2','passwords must be the same').equals(req.body.password);
  req.checkBody('email','email is required').notEmpty();
  req.checkBody('email','Enter a valid email').isEmail();
  req.checkBody('username','username is required').notEmpty();
   
  // validate the profile picture
  
  if (!req.file) {
    res.send('No files to upload.');
    return;
}

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render('users/register',{title:'Mega Flow - Register',errors:result.array(),success:false});
    }else{
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var password =bcrypt.hashSync(req.body.password);
      var email = req.body.email;
      var username = req.body.username;
      var photo = req.file;
      console.log(photo);

      // check if user exists
      users.findOne({username:username},function(err,user){
        if(user){
          var errors = [
            {
              msg:'Username Already exists '
            }
          ]
          res.render('users/register',{title:'Mega Flow - Register',errors:errors,success:false});
        }else{
          users.findOne({email:email},function(err,user){
            if(user){
              var errors = [
                {
                  msg:'Email Already exists '
                }
              ]
              res.render('users/register',{title:'Mega Flow - Register',errors:errors,success:false});
              return;
            }else{
              users.insert({
                firstname:firstname,
                lastname:lastname,
                password:password,
                email:email,
                username:username,
                photo: photo
              
              },function(err,user){
                if(err){
                  console.log('error saving user')
                }else{
                  res.render('users/register',{title:'Mega Flow - Register',errors:false,success:true});
                  // send confirmation email
                  var mailOptions = {
                    from: 'My Catalogue ',
                    to: email,
                    subject:'Registration Confirlmation',
                    text:'Your registration on MegaFlow was successful'
                  };
            
                  transporter.sendMail(mailOptions,function(err,info){
                    if(err){
                      console.log(err);
                    }else{
                      console.log('Email Sent');
                      res.render('index',{message:'Confirmation message has been sent your email', title:'My Catalogue'});
                    }
                  })
                  res.redirect(301,'index');
                }
              })
        
            }
          });
        }
      })
      
      

         }
  });

});

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
  res.render('users/change_password',{title:'Mega Flow - Change Password'});
});

router.post('/change_password',function(req,res,next){
  // validate inputs
  
})
// get user profile by id
router.get('/profile/:id',function(req,res,next){
  users.findOne({_id:req.params.id},function(err,user){
    if(err) throw err;
    res.json(user);
  })
});

module.exports = router;
