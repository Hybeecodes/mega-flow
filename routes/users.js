var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var multer = require('multer'); 
var users = db.get('users');
var bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: 'obikoya11@gmail.com',
    pass:'M.egastar98'
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
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req,res,next){
  res.render('users/login',{title:'Mega Flow - Login',errors:false});
});

router.get('/register',function(req,res,next){
  res.render('users/register',{title:'Mega Flow - Register',errors:false,success:false});
});

router.post('/login',function(req,res,next){
  req.checkBody('email','email field is required').notEmpty();
  req.checkBody('email','please  enter a valid email').isEmpty();
  req.checkBody('password','password field is required').notEmpty();

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      res.render('users/login',{title:'Mega Flow - Login',errors:result.array()});
    }else{
      var email = req.body.email;
      var password = req.body.password;
      users.findOne({email:email,password:password},function(err,user){
        if(err){
          console.log('login not successful');
        }
        res.render('index',{title:'Mega Flow',user:user});
      })
    }
  });
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
  


  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      res.render('users/register',{title:'Mega Flow - Register',errors:result.array()});
    }else{
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var password =bcrypt.hashSync(req.body.password);
      var email = req.body.email;
      var username = req.body.username;
      var photo = req.file;
      console.log(photo);

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

});

module.exports = router;
