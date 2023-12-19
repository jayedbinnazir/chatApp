const multer = require("multer");
var createError = require('http-errors')
const path = require('path') ;


function multiUploader( subfolder_pathe , allowed_file_types , max_file_size ,  max_number_of_files, error_msg  ) {

    const UPLOADS_FOLDER = path.resolve(__dirname+`/../public/uploads/${subfolder_pathe}`)


    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null , UPLOADS_FOLDER)
        },
        filename:function(req,file,cb){
            const fileExt = path.extname(file.originalname)
            const filename = file.originalname.replace(fileExt ,'')
                                                .split(' ')
                                                .join('-') + '-'+ Date.now()

            cb(null , filename+fileExt )
        }
    })

    const upload = multer({
        storage: storage,
        limits: {
          fileSize: max_file_size,
        },
        fileFilter: (req, file, cb) => {
          if (req.files.length > max_number_of_files) {
            cb(
              createError(
                `Maximum ${max_number_of_files} files are allowed to upload!`
              )
            );
          } else {
            if (allowed_file_types.includes(file.mimetype)) {
              cb(null, true);
            } else {
              cb(createError(error_msg));
            }
          }
        },
      });

    return upload ;
}


module.exports = multiUploader ;