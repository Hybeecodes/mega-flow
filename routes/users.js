var express = require('express');
var router = express.Router();
var app = require('../app');
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var multer = require('multer');
var users = db.get('users');
var userInfo = db.get('userInfo');
var bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
const passwoid = require('passwoid');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');


var csrfProtection = csrf({ cookie: true });
 router.use(csrfProtection);



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

router.get('/dashboard',function(req,res){
  if(req.user){
    res.render('users/dashboard',{title:'MegaSlack - dashboard',user:req.user,name:'dashboard'});
  }else{
    res.send('You need to login to access this page');
  }
})


router.get('/login',function(req,res,next){
  //console.log(req.session);
  res.render('users/login',{title:'Mega Flow - Login',errors:false,csrfToken:req.csrfToken()});
});

passport.use(new LocalStrategy(
  function(username,password,done){
    // var collection = db.get('users');
    users.findOne({username:username},function(err,user){
      if(err){
        throw err;
      }
      if(!user){
        console.log('unknown user');
        return done(null,false,{message:'unknown user'});

      }
      if(user){
        if(!bcrypt.compareSync(password,user.password)){
          console.log('invalid password');
          return done(null,false,{message:'Invalid password'});
        }else{
          return done(null,user);
        }
      }
      
    });
}
));

router.post('/update_profile',function(req,res,next){
  // validate input
  // req.checkBody('blog_name','enter a blog page name').notEmpty();
  // req.checkBody('username','please fill in a username').notEmpty();

  if(req.user){
    var blogname = req.body.blogname;
    var username = req.body.username;
    var email= req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var address = req.body.address;
    var city = req.body.city;
    var country = req.body.country;
    var postal_code = req.body.postal_code;
    var facebook = req.body.facebook;
    var twitter = req.body.twitter;
    var instagram = req.body.instagram;
    var about = req.body.about;

    //check if user info exist
    userInfo.findOne({email:req.user.email},function(err,user){
      if(err) throw err;
      if(user){
        // user info exists then update
        userInfo.update({email: email},
           {$set:{
             blogname:blogname,
             username:username,
             email:email,
             firstname:firstname,
             lastname:lastname,
             address:address,
             city:city,
             country:country,
             zipcode:zipcode,
             facebook:facebook,
             twitter:twitter,
             instagram:instagram,
             about:about
            }},function(err,result){
              if(err){
                console.log('error updating your profile');
              }else{
                console.log(req.user.username+"'s profile was updated successfully");
                res.render('users/profile',{user:req.user,title:'MegaFlow - profile', name:'profile',updateSuccess:true});
              }
        });
      }else{
        // user info doesn't exist, so create one
        userInfo.insert(
          {
            blogname:blogname,
            username:username,
            email:email,
            firstname:firstname,
            lastname:lastname,
            address:address,
            city:city,
            country:country,
            postal_code:postal_code,
            facebook:facebook,
            twitter:twitter,
            instagram:instagram,
            about:about
           },function(err,result){
             if(err){
               console.log('error updating your profile');
             }else{
               console.log(req.user.username+"'s profile was updated successfully");
               res.render('users/profile',{user:req.user,title:'MegaFlow - profile', name:'profile',updateSuccess:true});
             }
       });

      }
    })
  }else{
    res.send('you are not authorized  to view this page');
  }


})

router.get('/profile',function(req,res,next){
  console.log(req.session.passport.user);
  if(req.user){
    res.render('users/profile',{user:req.user,title:'MegaFlow - profile', name:'profile',csrfToken:req.csrfToken()});
  }else{
    res.send('You are not even logged in, which profile do you want to check???')
  } 
  
})

router.get('/image',function(req,res,next){
  res.send(req.user.photo);
})

router.post('/login',passport.authenticate('local',{
  failureRedirect:'/users/login',
  failureFlash:'Invalid username or password'
}),function(req,res,next){
  console.log('Authentication successful');
  //  req.session.username = req.body.username; 
  req.flash('success','You are logged in');
  var user = req.user;
  res.redirect(303,'/users/dashboard'); 
})


router.get('/logout',function(req,res){
  // req.session.destroy(function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log('you just logged out');
  //     res.redirect('/users/login');
  //     console.log(req.session);
  //   }
  // });
  req.logout();
  res.redirect('/users/login');

  });


router.get('/register',function(req,res,next){
  res.render('users/register',{title:'Mega Flow - Register',errors:false,success:false,csrfToken:req.csrfToken()});
});

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
  
//   if (!req.file) {
//     res.send('No files to upload.');
//     return;
// }

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render('users/register',{title:'Mega Flow - Register',errors:result.array(),success:false,csrfToken:req.csrfToken()});
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
          res.render('users/register',{title:'Mega Flow - Register',errors:errors,success:false,csrfToken:req.csrfToken()});
        }else{
          users.findOne({email:email},function(err,user){
            if(user){
              var errors = [
                {
                  msg:'Email Already exists '
                }
              ]
              res.render('users/register',{title:'Mega Flow - Register',errors:errors,success:false,csrfToken:req.csrfToken()});
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
                  res.render('users/register',{title:'Mega Flow - Register',errors:false,success:true,csrfToken:req.csrfToken()});
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
                  req.login(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect(303,'/users/dashboard');
                  });
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
  res.render('users/reset_password',{title:'Mega Flow - Reset Password',errors:false, success:false,csrfToken:req.csrfToken()});
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
  res.render('users/change_password',{title:'Mega Flow - Change Password',name:'changePass',errors:false,csrfToken:req.csrfToken()});
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
