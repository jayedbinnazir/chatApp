const multiUploader = require("../../utility/multiUploader")

const attachmentUpload=(req,res,next)=>{

    
    const upload = multiUploader(
        "attachments",
        ['image/jpeg' , 'image/png' , 'image/jpg' ],
        10000000,
        2,
        "Only .jpg, jpeg or .png format allowed!"
    )



    upload.any()(req,res,err=>{
        if (err) {
            res.status(500).json({
              errors: {
                avatar: {
                  msg: err.message,
                },
              },
            });
          } else {
            next();
          }
    })

}


module.exports=attachmentUpload ;