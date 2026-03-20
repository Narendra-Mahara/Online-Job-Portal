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
      !Array.isArray(requirements)  ||
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

export { createJob };
