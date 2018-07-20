const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
var bcrypt = require('bcrypt-nodejs');

// require('./db_config')
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findOne({_id:id}, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username,password,done){
        // console.log(username/)
      // var collection = db.get('users');
      User.findOne({username:username},(err,user)=>{
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
      })
  }
  ));

  module.exports = passport;