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

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        select: "title company location jobType",
      })
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No applications found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, applications, "Successfully fetched applications"),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Error while fetching the applications"));
  }
};

const getApplicationsByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json(new ApiResponse(404, null, "Job not found"));
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "Unauthorized: You do not have permission to view these applications.",
          ),
        );
    }

    const applications = await Application.find({
      job: req.params.id,
    })
      .populate("resume")
      .sort({ createdAt: -1 });
    if (applications.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No applications found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, applications, "Successfully fetched applications"),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Error while fetching the applications"));
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status?.trim()) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Status is required"));
    }

    const allowedStatuses = ["pending", "shortlisted", "rejected"];

    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
          ),
        );
    }
    const application = await Application.findById(req.params.id).populate(
      "job",
    );

    if (!application) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Application not found"));
    }

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "Unauthorized: You cannot update this application",
          ),
        );
    }
    application.status = status.toLowerCase(); // keep it lowercase for database consistency
    await application.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          application,
          "Application status updated successfully",
        ),
      );
  } catch (error) {
    console.error("Update Application Status Error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};
export {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};
