var express = require('express');
var router = express.Router();
var db =require('monk')('localhost/nodeblog');
var posts = db.get('posts');
var categories = db.get('categories');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
