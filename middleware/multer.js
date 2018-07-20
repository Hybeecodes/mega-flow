const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname+'-'+Date.now());
    }
});

module.exports = multer({storage:storage});