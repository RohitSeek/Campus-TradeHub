const review=require("../model/reviews")
const listing=require("../model/listing")
module.exports.createReview=async(req,res)=>{
    // console.log(req.params);
    // console.log("in body ",req.body);    
    let {id}=req.params;
    // console.log(id);
    const data=await listing.findById(id);
    // console.log(data);
    let newReview=new review(req.body);
    newReview.author=req.user._id;
    console.log(newReview);
    
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    req.flash("success","Review Added")
    res.redirect(`/listings/${id}`);

}

module.exports.deleteReview=async(req,res)=>{
    
    console.log("###########################################################");
    let {id,reviewId}=req.params;
   const a=await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   console.log(a); 
   await review.findByIdAndDelete(reviewId);      //delete from review db also
   req.flash("success","Delete Successfully")
   res.redirect(`/listings/${id}`);

}