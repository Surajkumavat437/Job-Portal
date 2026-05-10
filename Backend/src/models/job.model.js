import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    location:{
        type:String,
        required:true,
        trim:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    companyName:{
        type:String,
        trim:true,
    },
    jobType:{
        type:String,
        enum:["full-time", "part-time", "internship"],
        default:"full-time",
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, {
    timestamps:true,
})

const job = mongoose.model("Job", jobSchema);

export default job;