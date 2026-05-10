import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "accepted", "rejected"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({job:1, applicant:1}, {unique:true});

const application = mongoose.model("application", applicationSchema);

export default application;
