var express = require('express');
var router = express.Router();
var app = require('../app');
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var multer = require('multer');
var pages = db.get('pages');
var posts = db.get('posts');
var bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
var passport = require('passport');


router.get('/',function(req,res,next){
    if(req.user.username == 'megastar98'){
        blogs.find({},{},function(err,result){
            res.render('blogs/all_blogs',{title:'MegaFlow - Blogs',blogs:result,user:req.user});
        })
        
    }else{
        res.send('You are not authorized to view this page')
    }
});

router.get('/:username',function(req,res,next){
    posts.find({author:req.params.username},function(err,result){
        if(req.user){
            res.render('pages/userpage',{title:req.params.username,posts:result,user:req.user,name:''});
           }else{
            res.render('pages/userpage',{title:req.params.username,posts:result,user:false,name:''});
                    
            }
    });
    
});

//get post by id
router.get('/get_post/:id',function(req,res,next){
  if(req.user){
    posts.findOne({_id:req.params.id},function(err,post){
      if(err) throw err;
      res.render('posts/post',{title:'View Post',post:post,user:req.user,name:'myPost'});
    });
  }else{
    res.send('You are not authorized to view this page');
  }
  });
  

router.get('/:username/:post_id',function(req,res,next){
    posts.find({author:req.params.username,_id:req.params.post_id},function(err,result){
        if(err) throw err;
        if(req.user){
            res.render('pages/userpostpage',{title:req.params.username,post:result,user:req.user,name:''});
           }else{
            res.render('pages/userpostpage',{title:req.params.username,post:result,user:false,name:''});
            }
    });
});


router.post('/comment',function(req,res,next){
    
})





module.exports = router;