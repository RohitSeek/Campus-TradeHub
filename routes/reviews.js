const express=require('express');
const reviews = require('../model/reviews');
const listing=require('../model/listing')
const review=require("../model/reviews");
const {listingSchema,reviewSchema}=require('../schema.js')
const {isLoggedIn,savedRequestedUrl}=require("../middleware.js")

const router=express.Router({mergeParams:true});    // 
// while sending parameters to child routes through middleware that parameters will be stayed in app.js file only
// so merge that parent params with route used that.

const wrapAsync=require("../utils/wrapAsync.js");
const validateReview = (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error)
     {
        console.log(error);
         throw new ExpressError(400,error.message);
     }
     else   
        next();
}

const reviewController=require("../controllers/reviews.js")
router.route("/")
.post(isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

router.route("/:reviewId")
.delete(isLoggedIn,wrapAsync(reviewController.deleteReview))

module.exports=router