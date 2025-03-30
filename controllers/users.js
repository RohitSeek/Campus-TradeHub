const review=require("../model/reviews")
const listing=require("../model/listing")
const User=require("../model/user")
const sendVerificationEmail=require("../confiq/nodemail")
const crypto = require('crypto');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


module.exports.signUpForm=(req,res)=>{
    // res.send("page");
    // console.log("user page\\signup get route");
    res.render("users/signUp.ejs");
}
module.exports.signUp=async(req,res)=>{
    // console.log("in signup post req");
    let {email,username}=req.body;
    let newUser=new User({email,username});
    try{
        //it automatic check uniqness and do save 
   const registeredUser= await User.register(newUser,req.body.password)
        req.login(registeredUser,async(err)=>{
            if(err)
                return next(err);
            else
            {
                console.log("registeredUser in user.js ",registeredUser);
                const findUser= await User.findOne({username:username});
                const verificationToken = generateVerificationToken();
                findUser.verificationToken = verificationToken;
                findUser.save();
                console.log("Recipient is ",findUser.email);
                
                sendVerificationEmail(findUser, verificationToken);
                 
                // req.flash("success", "User Sign Up Successful");
                req.flash("success", "Verfication link sent to your email");
                res.redirect("/listings");
            }
        })
        
    }
    catch(error) {
        console.error(error.message);
        req.flash("error", "Username already exists");
        res.redirect("/signup");
    }
   
}
module.exports.logInForm=(req,res)=>{
    const sessionId = req.sessionID;
    console.log("Before log in session id ",sessionId);
    res.render("users/logIn.ejs");
}
module.exports.logOut=(req,res)=>{
    console.log(req.user);
    //inbuild functionality 
    req.logout((err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success","logged you out ");
            res.redirect("/listings");
        })
}
module.exports.logIn=async(req,res)=>{
    const sessionId = req.sessionID;
    console.log("After log in session id ",sessionId);
    
    req.flash("success","sucessfully logged in")
    //  console.log(res.locals.requestedUrl," + ",res.locals.requestedMethod);
    //directly cant use like this:-  req.session.requestedUrl 
    //it will give undefined beacause bydefault passport authentication reset that sessions
    //so it removes stored info
    //sol:- is to store in local storage and before authentication
    const requestedUrl = res.locals.requestedUrl || "/listings";
   
   // const requestedMethod = res.locals.requestedMethod || "GET"; // Default to GET if method is not found
// 
    // Append method as a query parameter to the URL
  
    // const redirectUrl = `${requestedUrl}?_method=${requestedMethod}`;
    
    res.redirect(requestedUrl);
    // res.redirect(requestedUrl);
    
    
}