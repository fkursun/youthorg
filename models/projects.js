var mongoose=require("mongoose");

var projectSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    ptype:String,
    subject:String,
    venue:String,
    dates:String,
    peoplenumber:String,
    agelimit:String,
    partners:String,
    completed:Boolean,
    createdtime:String
});

module.exports=mongoose.model("Project",projectSchema);