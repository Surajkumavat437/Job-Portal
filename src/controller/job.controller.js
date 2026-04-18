import job from "../models/job.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

export const createJob = async (req, res) => {
  const createdBy = req.user.id;
  const { title, description, location, salary, companyName, jobType } =
    req.body;

  if (!title || !description || !location || !salary) {
    throw new ApiError(400, "All fields are required");
  }

  const newJob = await job.create({
    title,
    description,
    location,
    salary,
    companyName,
    jobType,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Job created Successfully",
    data: newJob,
  });
};

export const getJobs = async (req, res) => {
  const allJobs = await job.find();

  res.status(200).json({
    success: true,
    message: "Jobs are fetched successfully",
    data: allJobs,
  });
};

export const getJobDetail = async (req, res) => {
  const { id } = req.params;

  const findJob = await job.findById(id);

  if (!findJob) {
    throw new ApiError(404, "User Not Found");
  }

  res.status(200).json({
    success: true,
    message: "Job detail fetched successfully",
    data: findJob,
  });
};



export const updateJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  const jobData = await job.findById(id);

  if (!jobData) {
    throw new ApiError(404, "job not found");
  }

  if (jobData.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  const {
    title,
    description,
    location,
    salary,
    companyName,
    jobType,
    createdBy,
  } = req.body;

  if (title) jobData.title = title;
  if (description) jobData.description = description;
  if (location) jobData.location = location;
  if (salary !== undefined) jobData.salary = salary;
  if (companyName) jobData.companyName = companyName;
  if (jobType) jobData.jobType = jobType;

  await jobData.save();

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: jobData,
  });
};


export const deleteJob = async(req,res)=>{
    const {id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid Job Id");
    }

    const  jobData = await job.findById(id);

    if(!jobData){
        throw new ApiError(404, "Job details not found");
    }

    if(jobData.createdBy.toString() !== req.user.id){
        throw new ApiError(403,"Forbidden");
    }

    await jobData.deleteOne();

    res.status(200).json({
        success:true,
        message:"Job is deleted successfully",
        data:jobData,
    })
}