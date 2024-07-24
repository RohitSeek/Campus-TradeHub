const express=require('express');
const User=require("../model/user");
const passport = require('passport');
const router=express.Router()
const {isLoggedIn,savedRequestedUrl}=require('../middleware')
const wrapAsync=require("../utils/wrapAsync.js");
const userController=require("../controllers/users.js")

router.route("/")
.get(userController.signUpForm)
.post(wrapAsync(userController.signUp))

router.route("/login")
.get(userController.logInForm)
.post(
    savedRequestedUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    userController.logIn
    )

router.route("/logout").
get(userController.logOut)

// fun()
// .then(()=>{
//     console.log("data found in users.js file");
// })
// .catch(()=>{
//     console.log("not found in users.js file");
// })
// async function fun()
// {
//   const a= await User.findOneAndDelete({username:"radhe"});
//   console.log("its in users.js file",a);
// }
module.exports=router


