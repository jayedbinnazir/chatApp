const User = require("../models/people")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

//get login page 
function getLogin(req,res,next){
    res.render('index')
}

//dologin
async function login(req,res,next){
    //find the user who has the email and the username
    try{

        const user = await User.findOne({
            $or:[ { email:req.body.username } , { mobile:req.body.username } ]
        })

        //check the password
        if( user && user._id ){
            const isValidPassword = await bcrypt.compare( req.body.password , user.password  )
            if(isValidPassword){
                const userObject = {
                    userid: user._id,
                    username: user.name,
                    email: user.email,
                    avatar: user.avatar || null,
                    role: user.role || "user",
                  };
                //generate token
                const token = jwt.sign( userObject , process.env.JWT_SECRET , { expiresIn:process.env.JWT_EXPIRY } )
                //set cookie
                res.cookie( process.env.COOKIE_NAME , token , {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true,
                } )
                
                 // set logged in user local identifier
                     res.locals.loggedInUser = userObject;
                     res.redirect("inbox");


            } else {
                throw createError("Wrong Password ! please try again");
                
            }
            
        } else {
            throw createError("User not found !");
        }


    }catch(err){
        res.render("index", {
            data: {
              username: req.body.username,
            },
            errors: {
              common: {
                msg: err.message,
              },
            },
          });
    }

}

//dologout
 function logout(req,res){
    res.clearCookie(process.env.COOKIE_NAME)
    res.send("logged out");

 }



module.exports = {
    getLogin,
    login,
    logout,
}