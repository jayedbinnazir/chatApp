var createError = require('http-errors')
//Not found handler (fault by client side)--> hitting unknown URL
const notFoundHandler=(req,res,next)=>{
    const error = createError(404, 'The Requested URL was not found');
    next(error)
}



//common error handler 

const errorHandler=(err,req,res,next)=>{
    
    res.locals.error = process.env.NODE_ENV.trim() === 'development' ? err : { message:err.message }
    res.status( err.status || 500 )
        if(res.locals.html){
            res.render('error',{
                title:"error page"
            })
        } else {
            res.json({
                message:err.message ,
                status:err.status,
                stack:err.stack
            })
        }
    
}


module.exports={
    notFoundHandler,
    errorHandler
}

