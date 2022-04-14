const multer = require('multer');
var path = require('path');
var  upload  =  multer ( {  dest : 'public/uploads/'  } ) 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')},
  filename:(req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

exports.upload = multer ({
    storage: storage
  })