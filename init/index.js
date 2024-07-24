const mongoose=require('mongoose')
const listing=require('../model/listing')
const reviews=require('../model/reviews')

const user=require('../model/user')

const init = require('./data')

main()
.then(res=>{
    console.log("Database Connected");

})
.catch(err=>{console.log(err);})
async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}


const initDB=async ()=>{
    await listing.deleteMany({});
    init.data=init.data.map((obj)=>({
        ...obj,
        owner:'65ee1b991c3c605c32c370ae'
    }))
    await listing.insertMany(init.data);

    console.log(init.data);
    console.log("Data intialization success..");

}
// initDB();
reviews.find({}).populate("author")
.then(res=>{console.log(res)})
.catch(err=>console.log(err))

// console.log(data.data);

// listing.insertMany(data.data)
// .then(res=>{console.log("insertion sucessfull");})
// .catch(err=>console.log(err))
// const a=new listing({
//     title:"radhe",
//     description:"mujhe bhi nahi pata",
//     image:{url:"google.com"}
// })



// a.save()

// .then(res=>{console.log("show ",res);})
// .catch(err=>console.log(err))
// listing.find({title:'sham'})