var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var posts = db.get('posts');
var categories = db.get('categories');
var Paginate = require('mongo-paginate');



/* GET posts listing. */
router.get('/', function(req, res, next) {

    posts.find({},{},function(err,posts){
      res.render('posts/posts', { title: 'Mega Flow - Posts',posts:posts });
    });
    
  });
  

//get post by id
router.get('/get_post_by_id/:id',function(req,res,next){
    posts.findOne({_id:req.params.id},function(err,post){
      if(err) throw err;
      res.render('posts/post',{title:'View Post',post:post});
    });
    
  });
  
  router.get('/add_post',function(req,res,next){
    categories.find({},{},function(err,categories){
        res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:categories,errors:false});
    });
    
  });
  
  router.post('/add_post',function(req,res,next){
    
    req.checkBody('title','title field is required').notEmpty();
    req.checkBody('body','details field is required').notEmpty();
  
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        categories.find({},{},function(err,categories){
          res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:categories,errors:result.array()});
      });
      }else{
        var title = req.body.title;
        var category = req.body.category;
        var body = req.body.body;
        var author = 'megastar';
        var date = new Date();
      }
      var db= req.db;
      var posts = db.get('posts');
  
      posts.insert({
        title:title,
        category:category,
        body:body,
        author:author,
        date:date
      },function(err,post){
        if (err)
          console.log('error adding post');
        else{
          res.redirect('/');
        }
      })
      
    });
  });

  // get posts by category
router.get('/get_posts_by_category/:cat',function(req,res,next){
  posts.find({category:req.params.cat},function(err,posts){
    res.json(posts);
  });
});



module.exports = router;
