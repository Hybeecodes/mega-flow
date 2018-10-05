 var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const addRequestId = require('express-request-id')();
// var flash = require('connect-flash');
var passport = require('passport');
const subdomain = require('express-subdomain');
var LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash-messages');
const csrf = require('csurf');
require('./config/db_config');


var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var pages = require('./routes/pages');

// var csrfProtection = csrf({ cookie: true })

var app = express();
app.use(subdomain('posts', posts));
// app.use(addRequestId);
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24  // 1 day 
  },

  resave: true,
  saveUninitialized: true,
  // 
}));
// logger.token('id',function getId(req){
//   return req.id;
// });

// var loggerFormat = ':id [":date[web]]" :method :url" :status :responsetime ';

// app.use(logger(loggerFormat,{
//   skip: function(req,res){
//     return res.statusCode < 400
//   },
//   stream: process.stderr
// }));
// app.use(logger(loggerFormat,{
//   skip: function(req,res){
//     return res.statusCode >= 400
//   },
//   stream: process.stdout
// }));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));

//connect-flash
app.use(flash());
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/categories',categories);
app.use('/pages',pages);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;