var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');
var posts = db.get('posts');
var categories = db.get('categories');
var Paginate = require('mongo-paginate');



/* GET posts listing. */
router.get('/', function(req, res, next) {
  if(req.user){
    posts.find({},{},function(err,posts){
      res.render('posts/posts', { title: 'Mega Flow - Posts',posts:posts, user:req.user });
    });
  }else{
    res.send('Pls login to view all posts');
  }
    
    
  });
  

//get post by id
router.get('/get_post_by_id/:id',function(req,res,next){
  if(req.user){
    posts.findOne({_id:req.params.id},function(err,post){
      if(err) throw err;
      res.render('posts/post',{title:'View Post',post:post,user:req.user});
    });
  }else{
    res.send('You are not authorized to view this page');
  }
    
    
  });
  
  router.get('/add_post',function(req,res,next){
    if(req.user){
      categories.find({},{},function(err,categories){
        res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:categories,errors:false,user:req.user,name:'addPost'});
    });
    }else{
      res.send('you can only add post as a user');
    }
    
    
  });
  
  router.post('/add_post',function(req,res,next){
    
    req.checkBody('title','title field is required').notEmpty();
    req.checkBody('body','details field is required').notEmpty();
  
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        categories.find({},{},function(err,categories){
          res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:categories,errors:result.array(),user:req.user,name:'addPost'});
      });
      }else{
        var title = req.body.title;
        var category = req.body.category;
        var body = req.body.body;
        var author_id = req.user._id;
        var date = new Date();
        
        posts.insert({
          title:title,
          category:category,
          body:body,
          author:author_id,
          date:date
        },function(err,post){
          if (err){
            console.log('error adding post');
            throw err;
          }
            
          else{
            res.redirect('/posts');
          }
        })
      }  
      
      
    });
  });

  // get posts by category
router.get('/get_posts_by_category/:cat',function(req,res,next){
  posts.find({category:req.params.cat},function(err,posts){
    res.json(posts);
  });
});

// get posts by user
router.get('/get_by_user/:user',function(req,res,next){
  posts.find({author:req.params.user},function(err,post){
    
  })
})



module.exports = router;
