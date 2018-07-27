 var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var csrf = require('csurf');
require('./config/db_config');
const flash = require('express-flash-messages');
// var MongoDBStore = require('connect-mongodb-session')(session);

// require('events').EventEmitter.prototype._maxListeners = 100;
// var store = new MongoDBStore(
//   {
//     uri: 'mongodb://localhost:27017/nodeblog',
//     collection: 'mySessions'
//   });


var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var pages = require('./routes/pages');

// var csrfProtection = csrf({ cookie: true })

var app = express();
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// store.on('error', function(error) {
//   assert.ifError(error);
//   assert.ok(false);
// });


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
}))

app.use(passport.initialize());
app.use(passport.session());

// app.use(csrf);
// app.use(function(req, res, next){
//   res.locals._csrfToken = req.csrfToken();
//   next();
//   });

// app.use(function(req, res, next){
//   // if there's a flash message, transfer
//   // it to the context, then clear it
//   res.locals.flash = req.session.flash;
//   delete req.session.flash;
//   next();
//   });

app.use(expressValidator());
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;
 
//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));


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