const mongoose=require('mongoose')

//Create a new Schema for users
const userSchema=new mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "age":{
        type:Number,
        required:true
    },
    "email":{
        type:String,
        require:true
    },
    "date":{
        type:String,
        required:true
    },
    "batch":{
        type:String,
        required:true
    },
    "plan":{
        type:String,
        required:true
    }
})

//Create new collection of users using the new schema
const newCollection=new mongoose.model("user",userSchema)

module.exports=newCollection