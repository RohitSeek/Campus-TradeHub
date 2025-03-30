const mongoose=require('mongoose')
const review=require('./reviews');
const user=require('./user');
const { string } = require('joi');

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    //set:- from front end , default: backebd 
    image:{

        // set:(v)=>
        //     v === ""
        //     ?"https://www.istockphoto.com/photo/maldives-island-resort-over-water-villas-gm1220728896-357558218"
        //     :v,
    
        filename:{
            type:String,
        }, 
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZpbGxhfGVufDB8fDB8fHww"
            }       
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    country:{
        type:String
    },
    reviews:
    [
        {
        type:mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ] ,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
  console.log("in mongoose delet middleware..");
  if(listing.reviews)
    {
    await review.deleteMany({_id:listing.reviews})
    }
    console.log(listing.reviews);
})

//model
const Listing=mongoose.model('Listing',listingSchema)

module.exports=Listing
