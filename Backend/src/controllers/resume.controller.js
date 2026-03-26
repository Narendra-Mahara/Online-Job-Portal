import { Resume } from "../models/resume.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
const createResume = async (req, res) => {
  try {
    const { personalInfo, summary, education, experience, skills, projects } =
      req.body;

    if (
      !personalInfo ||
      !personalInfo.fullName?.trim() ||
      !personalInfo.email?.trim() ||
      !personalInfo.phone?.trim() ||
      !validator.isEmail(personalInfo.email) ||
      !summary?.trim() ||
      !Array.isArray(education) ||
      education.length === 0 ||
      !Array.isArray(experience) ||
      experience.length === 0 ||
      !Array.isArray(skills) ||
      skills.length === 0 ||
      !Array.isArray(projects) ||
      projects.length === 0
    ) {
      throw new ApiError(400, "All fields are required and must be valid");
    }

    const resume = await Resume.create({
      user: req.user._id,
      personalInfo,
      summary,
      education,
      experience,
      skills,
      projects,
    });
    if (!resume) {
      return res
        .status(500)
        .json(new ApiError(500, "Error while creating resume"));
    }
    return res
      .status(201)
      .json(new ApiResponse(201, resume, "Resume created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while creating resume", error));
  }
};

const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Resume ID is needed"));
    }

    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      user: req.user._id,
    });
    if (!deletedResume) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Successfully deleted resume"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error while deleting resume", error));
  }
};
export { createResume, deleteResume };
