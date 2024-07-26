const listing=require("../model/listing")
const mbxGeocoing = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoing({ accessToken: process.env.MAP_TOKEN });

// stylesService exposes listStyles(), createStyle(), getStyle(), etc.

 
module.exports.index=async(req,res)=>{
    const allListings=await listing.find({});
     
    // console.log("this is one mthod to send flash  ",msg);
    // by res.locals.success autpmatic success varible value is assign for all routes
      res.render("listings/index.ejs",{allListings,site_url:process.env.SITE_URL});
  }
module.exports.newListForm=(req,res)=>{

    res.render("listings/new.ejs",{site_url:process.env.SITE_URL});
}

module.exports.showList=async(req,res,next)=>{
    console.log(req.params);
    const {id}=req.params;
    try{
    const listingData=await listing.findById(id).populate("owner").populate({
      path:"reviews",
      populate:{
              path:"author",            
      },
      })
      if(!listingData)
          {
              req.flash("error","listing does not exist")
              res.redirect("/listings");
          }
      else{
            // console.log("listing data ",listingData);
            // console.log("port no ",process.env.PORT_NO);
            res.render("listings/show.ejs",{listingData,site_url:process.env.SITE_URL});
           }
    }
    catch(err){
            console.log(`Something went wrong in /:${id}  of listings.js file..`);
                next((new ExpressError(404,"Page Not Found")));
            }
}
module.exports.createNewList=async(req,res,next)=>{
   
  
      try{
    const {title,description,price,country}=req.body;
       let  image=req.file.path
       const filename=req.file.filename
        console.log(req.file);
         console.log(image);
       const listings = new listing(req.body);

       listings.image={url:image,filename};
       listings.owner=req.user.id;

       const response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit:1
          }).send()

    listings.geometry=response.body.features[0].geometry;
    const a=await listings.save();
    console.log("created lising ",a);
    req.flash("success","New Listing created");
    res.redirect("/listings");
    }
    catch(err){
        console.log("in catch ");
        console.log(err.name);
        console.log(err.message);
        next(err);
    }
     
}
module.exports.editForm=async (req,res)=>{
    const {id}=req.params;
    console.log("IN get of /:id/edit ");
    const listingData=await listing.findById(id).populate("owner");
    if(!listingData)
        {
            req.flash("error","Listing is not their")
            res.redirect("/listings")
        }
    console.log(listingData);
    if(listingData.owner.id === req.user.id)
        {
            let originalUrl=listingData.image.url;
            console.log(listingData.image.url);
            originalUrl=originalUrl.replace("/upload","/upload/h_200,w_300")
            console.log(originalUrl);
            return res.render("listings/edit.ejs",{listingData,originalUrl});
        }
    else
    {
        req.flash("error","Not Authorized to Edit this post")
        res.redirect(`/listings/${id}`);
    }

}

module.exports.editList=async(req,res,next)=>{
    const {id}=req.params;
   
    console.log("###############################################",req.body);
    

    const prevData=await listing.findById(id);
    console.log("prev data:- ",prevData);

    const{title,description,price,location,country}=req.body;

    const response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit:1
          }).send()
    try{
    const updatedListing = await listing.findOneAndUpdate(
        { _id: id }, // Condition to find the document
        {
          $set: {
            title,
            description,
             // Update the 'image.url' property based on the condition
            price,
            location,
            country,
            geometry:response.body.features[0].geometry
          }
        },
        { new: true } // Return the updated document
      );
    //   updatedListing.geometry=response.body.features[0].geometry;
    //doubt: as we cant update like this it will not update in exising document
        // updatedListing.image.url=req.file.path, 
        // updatedListing.image.filename=req.file.filename

    if(req.file)
      {
       const updatedImageListing = await listing.findOneAndUpdate(
            { _id: id }, // Condition to find the document
            {
              $set: {
                'image.url':req.file.path,
                'image.filename':req.file.filename
              }
            })
        }
            
       
      
       console.log("new Updated data: ",updatedListing); 
       req.flash("success","Listing Edit Successful")
    res.redirect(`/listings/${id}`);

    }
    catch(err){
        console.log("error in put request");
        next(err);
    }
}

module.exports.destroyList=async(req,res)=>{
    const {id}=req.params;

    const userData=await listing.findById(id).populate("owner");
    console.log(userData);
    if(userData.owner.id === req.user.id){
       
        const DeletedData=await listing.findByIdAndDelete(id);
        req.flash("success","Listing deleted")
        return res.redirect("/listings");
    }
    else
    {
        req.flash("error","Not Authorized to Delete this post")
       return res.redirect(`/listings/${id}`);
    }
   
    // console.log("called delete ",id);
    // const DeletedData=await listing.findByIdAndDelete(id);
    // console.log(DeletedData);
    
}