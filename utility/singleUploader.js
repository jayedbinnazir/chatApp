var createError = require('http-errors')
const multer = require('multer') ;
const path = require('path') ;

// avatar uploading capability
function uploader(subfolder_pathe , mimeTypes , fileSize , error_message   ){

    const UPLOADS_FOLDER = path.resolve(__dirname+`/../public/uploads/${subfolder_pathe}`)

    const storage = multer.diskStorage({
        destination:function(req,file ,cb){
            cb(null , UPLOADS_FOLDER )
        },

        filename:function(req,file , cb){
            const fileExt = path.extname(file.originalname)
            const filename = file.originalname.replace(fileExt ,'')
                                                .split(' ')
                                                .join('-') + '-'+ Date.now()

            cb(null , filename+fileExt )
        }

        

    })

    const upload = multer({
        storage:storage,
        limits:{
            fileSize:fileSize
        },
        fileFilter:function(req,file,cb){
            if(mimeTypes.includes( file.mimetype )){
                cb(null , true )
            } else {
                cb( createError(error_message) )
            }
        }
    })

    return upload ;
}


module.exports =uploader ;