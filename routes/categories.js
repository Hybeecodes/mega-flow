var express = require('express');
var router = express.Router();
var db =require('monk')('localhost/megaflow');
var posts = db.get('posts');
var categories = db.get('categories');
var posts = db.get('posts');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/add_cat',function(req,res,next){
  if(req.user){
    res.render('add_category',{title:'MegaFlow - Add Category',user:req.user,name:'addCat'});
  }else{
    res.send('You need to be a user to add category');
  }
})

router.post('/add_cat',function(req,res,next){{
  if(req.user){
    var cat_name = req.body.category;
    var cat_author = req.user.username;

    categories.insert({cat_name:cat_name,cat_author:cat_author},function(err,result){
      if(err){
        console.log('error saving category to database');
      }else{
        res.redirect(303,'/categories/view_my_cat');
      }
    })
  }else{
    res.send('You are not permited to submit an unauthorized form')
  }
}});

router.get('/view_my_cat',function(req,res,next){
  if(req.user){
    categories.find({cat_author:req.user.username},function(err,result){
      if(err){
        res.send('Hi'+req.user.username+', an error occured when fetching your categories')
      }else{
        res.render('view_my_cat',{title:'MegaFlow',name:'viewCat',user:req.user,cats:result})
      }
    })
  }else{
    res.send('You need to be logged in to view category');
  }
})




module.exports = router;
