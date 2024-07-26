// to start/stop mongodb
// sudo brew services stop mongodb-community@7.0 
// sudo brew services start mongodb-community@7.0 
require('dotenv').config()
// to access env file data :- process.env.PORT_NO

// console.log(process.env)
// console.log(SECRETE);
const express=require('express')
const app=express();
const mongoose=require('mongoose')
const passport=require("passport");
const LocalStrategy=require('passport-local')
const User=require('./model/user')

//for sessions
const session=require('express-session')
const flash=require('connect-flash')
const MongoStore = require('connect-mongo'); 

//routes
const listings=require("./routes/listings")
const reviews=require("./routes/reviews")
const users=require("./routes/users")

//models
const listing=require('./model/listing')
const review=require("./model/reviews"); 

const data=require('./init/data')
const path=require('path')
const ejsMate=require('ejs-mate')
app.engine('ejs',ejsMate)
const expressError=require('./utils/ExpressError')
const {listingSchema,reviewSchema}=require('./schema')


//serve static file
app.use(express.static(path.join(__dirname,"/public")) )
//for override request
const methodOverride=require('method-override');
const { log } = require('console');
const { lstat } = require('fs');
app.use(methodOverride('_method')); 

//setUp for ejs files 
app.set("view engine","ejs")
app.set('views',path.join(__dirname,"/views"))

// for urlencoded data
// app.use(express.urlencoded({extended:false}))
// to parse form data
app.use(express.urlencoded({extended:true}))
//to parse json data
app.use(express.json())

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is listnening`);
})

//from util
const wrapAsync=require("./utils/wrapAsync");
const ExpressError = require('./utils/ExpressError');
const { isDataView } = require('util/types');
const user = require('./model/user');

app.get("/",(req,res)=>{
    res.redirect("/listings")
})
 
//to create a session , store . session managemenet
// and before use passport session 
// const mongoUrl="mongodb://localhost:27017/wanderlust";

const sessionOptions={
    secret:process.env.SECRET_SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: `${process.env.DB_URL}`,
        // mongoUrl: `${process.env.MONGO_DB_URL}`,
        
    }),
    cookie:
    {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions))
app.use(flash()) // Use connect-flash middleware to use req.flash

//to use passport in express  should be intialize after session cration and before exact passport.session
app.use(passport.initialize());


// If your application uses persistent login sessions
 //passport session
 // agar page to page browse ho raha hain to to same session me chise ho
 // har ek request ko pata ho o kis chise ka part hain
app.use(passport.session())
 //strategy and model that wnat to authincate
passport.use(new LocalStrategy(User.authenticate()))

 //useres releated ek session ke data store karna log in details etc. :- serialize
 passport.serializeUser(User.serializeUser());

 // data nikal dena mtlab deserialize
 passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    
    //can be access in ejs files also
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;         //for all ejs files
    next();
})


main()
.then(res=>{console.log("Database Connected");})
.catch(err=>{console.log("something wrong happen while connecting database",err);})
async function main()
{
    console.log("trying to connect ",process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL)
    // await mongoose.connect(process.env.MONGO_DB_URL)
}
 
app.use("/signup",users)
app.use("/",users)  //for log in 
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)
// app.use

//toa path which are not mention in above then it will throw error 
app.all("*",(req,res,next)=>{
    next((new ExpressError(404,"Page Not Found")));
})




app.use((err,req,res,next)=>{
    let {status=500,message="something went Wrong"}=err;
    console.log("in error handling middleware");
    console.log(err.status);
    console.log(err.message)
    res.status(status).render("error.ejs",{message,error:err.status});
});
 