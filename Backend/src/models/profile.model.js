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
            trim: true,
            // Security: limit bio length
            maxlength: [2000, "Bio must be 2000 characters or fewer"],
        },

        skills: {
            type: [String],
            default: [],
            // Security: validate that there are not too many skills, each of a reasonable length
            validate: {
                validator: function (v) {
                    if (v.length > 100) return false;
                    for (let skill of v) {
                        if (typeof skill !== 'string' || skill.length > 50) return false;
                    }
                    return true;
                },
                message: "Skills array must contain at most 100 strings, each max 50 characters",
            },
        },

        experience: {
            type: String,
            trim: true,
            // Security: limit experience length
            maxlength: [1000, "Experience must be 1000 characters or fewer"],
        },

        education: {
            type: String,
            trim: true,
            // Security: limit education length
            maxlength: [1000, "Education must be 1000 characters or fewer"],
        },

        resume: {
            type: String,
            // Security: URL format validation
            match: [/^https:\/\//, "Resume must be a valid HTTPS URL"],
            maxlength: [2000, "Resume URL must be 2000 characters or fewer"],
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;