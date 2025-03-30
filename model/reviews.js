const mongoose=require('mongoose')
const {Schema}=mongoose;
const user=require('./user')
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:String,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:user
    }
})
module.exports=mongoose.model("review",reviewSchema);

