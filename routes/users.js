var express = require('express');
var router = express.Router();

const passport = require('../config/passport');
const EnsureLoggedIn = require('../middleware/ensureLoggedIn');
const UserController = require('../controllers/UserController');
const uploadFile = require('../middleware/multer');

router.use(EnsureLoggedIn);

/* GET users listing. */
router.get('/',UserController.getIndex);

router.get('/dashboard',UserController.getDashboard);


router.post('/profile',uploadFile.single('photo'),UserController.updateProfile);

router.get('/profile',UserController.getProfile);


router.get('/logout',UserController.logout);
//change password
router.get('/change_password',UserController.getChangePass);

router.post('/change_password',UserController.changeUserPass)

module.exports = router;
