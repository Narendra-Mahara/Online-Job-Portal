import { Job } from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      jobType,
      company,
      location,
      salaryRange,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !Array.isArray(requirements) ||
      !jobType ||
      !company?.trim() ||
      !location?.trim() ||
      !salaryRange?.min ||
      !salaryRange?.max
    ) {
      throw new ApiError(400, "All the fields are required");
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      jobType,
      company,
      location,
      salaryRange,
      employer: req.user._id,
    });
    if (!job) {
      throw new ApiError(500, "Error while creating job");
    }
    res.status(201).json(new ApiResponse(201, job, "Job created successfully"));
  } catch (error) {
    console.error("Create Job Error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};

const getAllJobs = async (req, res) => {
  try {
    // Only fetch jobs where the status is "active"
    // .sort({ createdAt: -1 }) puts the newest jobs first
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No active jobs found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Successfully fetched jobs"));
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, job, "Job fetched successfully"));
  } catch (error) {
    console.error("Get Job by ID Error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};

const getEmployerJob = async (req, res) => {
  try {
    const id = req.user._id;

    const jobs = await Job.find({ employer: id });

    if (jobs.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No jobs found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Successfully fetched jobs"));
  } catch (error) {
    console.error("Get Employer Jobs Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Server Error"));
  }
};

const updateJobStatus = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(400, "Invalid job id");
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }
  let result = await Job.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: "closed",
      },
    },
    {
      new: true,
    },
  );
  res
    .status(200)
    .json(new ApiResponse(200, result, "Status updated successfully"));
};

export { createJob, getAllJobs, getJobById, getEmployerJob, updateJobStatus };
