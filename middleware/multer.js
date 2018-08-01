const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images/uploads')
    },
    filename:(req,file,cb)=>{
        var mime = (file.mimetype).split("/");
        cb(null, `${file.fieldname}-${Date.now()}.${mime[1]}`);
    }
});

module.exports = multer({storage:storage});