const bcrypt = require('bcrypt');
const fs = require('fs')
// get users page

const User = require("../models/people");
const path = require('path');

 
async function getUsers(req,res,next){

    const users =await User.find()

    res.render('users',{
        users:users ,
        title:"users page"
    })
}

//add user
async function addUser(req,res,next){
    let newUser ;
    let hashedPassword = await bcrypt.hash(req.body.password , 10)
    if( req.files.length > 0 ){
        newUser = new User({
            ...req.body ,
            password:hashedPassword ,
            avatar:req.files[0].filename
        })
    } else {
        newUser = new User({
            ...req.body ,
            password:hashedPassword
        })
    }

    // save the user in the database
    try{
        const user = await newUser.save()
        res.status(200).json({
            data:user,
            msg:'user was added successfully'
        })

    } catch(err) {
        //if there is any plm with saving the data
        res.status(500).json({
            errors:{
                common:{
                    msg:"There was a problem with saving the data"
                }
            }
        })
    }

}


//delete the user

async function deleteUser(req,res,next){
        try{
            const user = await User.findByIdAndDelete({ _id:req.params.id })
            if(user.avatar){
                const filePath = path.resolve(__dirname+`/../public/uploads/avatars/${user.avatar}`)
                console.log(filePath)
                fs.unlink( filePath ,(err)=>{
                    console.log('file remove executed')
                    if(err){
                        console.log(err)
                    }
                } )
            }
            res.status(200).json({
                message:`user ${user.name}  removed successfully`
            })
        } catch(err){
            res.status(500).json({
                errors: {
                  common: {
                    msg: "Could not delete the user!",
                  },
                },
              });
        }
}
  

module.exports = {
    getUsers,
    addUser,
    deleteUser,
}