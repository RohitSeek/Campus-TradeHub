const express=require('express')
const router=express.Router()
const listing=require('../model/listing')

//for file releated data from form
const multer=require("multer")
//for upload files to cloud
const {storage}=require("../cloudConfiq.js")

const upload = multer({ storage})

//middleware js
const {isLoggedIn,savedRequestedUrl}=require("../middleware.js")

//validation to schema
const {listingSchema,reviewSchema}=require('../schema.js')
// console.log(listingSchema);

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');


const validateListing = (req,res,next)=>{
    console.log("its request body ");
    console.log(req.body)
    //Doubt2(solved) during  Validation not getting validation error like:- price is not a number etc.
    // console.log(listingSchema);
    const {error}=listingSchema.validate(req.body);
   
    if(error)
     {
        console.log(" in validate error ",{error});
         throw new ExpressError(400,error);
     }
     else   
        next();
}
//controllers
const listingController=require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
// .post(upload.single('image'),(req,res)=>{
//     console.log("in post of listings");
//     console.log(req.body);
//     console.log(req.file.path);
//     res.send(req.file);
   
// }) 
// upload.single('image')
.post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.createNewList))

router.route("/new")
.get(isLoggedIn,listingController.newListForm) 

router.route("/:id")
.get(wrapAsync(listingController.showList))
.put(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.editList))

router.route("/:id")
.delete(isLoggedIn,wrapAsync(listingController.destroyList))

router.route('/:id/edit')
.get(isLoggedIn,wrapAsync(listingController.editForm))

// to give all its access to whoever want to acess
module.exports=router
  