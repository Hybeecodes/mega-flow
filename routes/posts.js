var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var db = require('monk')('mongodb://mega:mega@ds147034.mlab.com:47034/mega-flow');
// var db = require('monk')('localhost/megaflow');
var posts = db.get('posts');
var categories = db.get('categories');
var Paginate = require('mongo-paginate');
var multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/post_uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage })



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
  
  router.get('/add_post',function(req,res,next){
    if(req.user){
      categories.find({cat_author:req.user.username},function(err,result){
        res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:result,errors:false,user:req.user,name:'addPost'});
    });
    }else{
      res.send('you can only add post as a user');
    }
    
    
  });
  
  router.post('/add_post',upload.single('post_img'),function(req,res,next){
    
    req.checkBody('title','title field is required').notEmpty();
    req.checkBody('body','details field is required').notEmpty();
  
    req.getValidationResult().then(function(result) {
      
        // result.array().push({'params':'post_img','msg':'no image','value':''});
      if (!result.isEmpty()) {
        console.log(result.array())
        categories.find({cat_author:req.user.username},function(err,result){
          res.render('posts/add_post',{title:'Mega Flow - Add Post', categories:result,errors:result.array(),user:req.user,name:'addPost'});
      });
      }else{
        var title = req.body.title;
        var category_id = req.body.category;
        var body = req.body.body;
        var author = req.user.username;
        var date = new Date();
        if(req.file){
          var post_img = req.file;
        }else{
          var post_img = '';
        }
        
        posts.insert({
          title:title,
          category_id:category_id,
          body:body,
          author:author,
          date:date,
          post_img:post_img
        },function(err,post){
          if (err){
            console.log('error adding post');
            throw err;
          }
            
          else{
            res.redirect('/posts/my_posts');
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
router.get('/my_posts',function(req,res,next){
  if(req.user){
  posts.find({author:req.user.username},function(err,result){
    categories.find({},{},function(err,cat){
      res.render('posts/my_posts',{title:'MegaFlow - View Posts',name:'myPosts',posts:result, user:req.user,categories:cat});
    })
  })
  }else{
    res.send('You are not authorized to view posts');
  }
})



module.exports = router;
