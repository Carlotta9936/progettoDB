const multer = require('multer');
var  upload  =  multer ( {  dest : 'public/uploads/'  } ) 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/img')},
    filename:(req, file, cb) => {
      cb(null, 'images/')
      //return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  })
  
  upload = multer ({
    storage: storage
  })

  
  module.exports = storage;