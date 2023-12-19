var jwt = require('jsonwebtoken');
const createError = require("http-errors");


function checkLogin(req,res,next){

    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null

    if(cookies) {
        try {
            let token = cookies[process.env.COOKIE_NAME]
            let decoded = jwt.verify(token, process.env.JWT_SECRET) // user info

            //for the json response 
            req.user = decoded

            //for html response
            if(res.locals.html) {
                res.locals.loggedInUser = decoded ;
              }
              next()

        } catch(err){
            //authentication failure if cookie is not found
            if(res.locals.html){
                console.log('redirection')
                res.redirect('/')
            } else {
                res.status(500).json({
                    errors:{
                        common:{
                            msg:"authentication Failure"
                        }
                    }
                })
            }
        }
    } else {
      if(res.locals.html){
        res.redirect('/')
      } else {
        res.status(401).json({
            errors:{
                common:{
                    msg:"authentication failure"
                }
            }
        })
      }
    }


}

// redirect already logged in user to inbox pabe
const redirectLoggedIn = function (req, res, next) {
    let cookies =
      Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  
    if (!cookies) {
      next();
    } else {
      res.redirect("/inbox");
    }
  };

  // guard to protect routes that need role based authorization
function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, "You are not authorized to access this page!"));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "You are not authorized!",
            },
          },
        });
      }
    }
  };
}

  
  module.exports = {
    checkLogin,
    redirectLoggedIn,
    requireRole,
  }