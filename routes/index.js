var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var db =require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Mega Flow'});
});
router.get('/session',function(req,res,next){
    res.send('Hello ' + JSON.stringify(req.session));
})




module.exports = router;
