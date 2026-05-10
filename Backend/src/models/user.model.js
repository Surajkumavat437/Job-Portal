import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["job_seeker", "recruiter"],
        required:true,
        default:"job_seeker",
    },
},{
    timestamps:true
})

const User = mongoose.model("User", userSchema);

export default User;