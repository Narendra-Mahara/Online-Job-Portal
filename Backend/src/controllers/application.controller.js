import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Resume } from "../models/resume.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const applyForJob = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Please create a resume profile before applying.",
          ),
        );
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json(new ApiResponse(404, null, "Job not found"));
    }

    if (job.status !== "active") {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "This job is no longer accepting applications.",
          ),
        );
    }

    const newApplication = await Application.create({
      applicant: req.user._id,
      job: jobId,
      resume: resume._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newApplication,
          "Successfully applied for the job",
        ),
      );
  } catch (error) {
    // Check for duplicate key error (E11000) which indicates the user has already applied to this job
    if (error.code === 11000) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "You have already applied for this job"),
        );
    }

    console.error("Error applying for job: ", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};

export { applyForJob };
