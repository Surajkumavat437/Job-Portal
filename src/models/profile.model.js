import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    bio: {
      type: String,
      trim:true,
    },

    skills: {
      type: [String],
       default:[]
    },

    experience: {
      type: String,
    },

    education: {
      type: String,
    },

    resume: {
      type: String,
    },

    profilePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;