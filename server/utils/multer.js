const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        let folder;

        if(req.body.role === 'Theatres'){
            folder = 'uploads/Theatres'
        }else if(req.body.role === 'Movies'){
            folder = 'uploads/Movies'
        }else if(req.body.role === 'Screens'){
            folder = 'uploads/Screens'
        }

        cb(null,folder)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
      } 
})

const upload = multer({storage})

module.exports = upload