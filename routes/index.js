var express = require('express');
var router = express.Router();
var formidable = require('formidable');

const GuestController = require('../controllers/GuestController');
const passport = require('../config/passport');
const uploadFile = require('../middleware/multer');

/* GET home page. */
router.get('/',GuestController.getIndex);

// router.get('/session',(req,res)=>{
//     res.send(req.user);
// })

router.post('/login',GuestController.authenticateUser);

router.get('/login',GuestController.getLogin); 

router.get('/register',GuestController.getRegister);

router.post('/register',uploadFile.single('photo'),GuestController.register);

//forgot password
router.get('/reset_password',GuestController.getResetPass);

router.post('/reset_password',GuestController.resetUserPass);

router.get('/post/:postId',GuestController.getUserPost);

router.post('/post_comment',GuestController.postComment);

router.get('/paginate',GuestController.paginatePost);

module.exports = router;
