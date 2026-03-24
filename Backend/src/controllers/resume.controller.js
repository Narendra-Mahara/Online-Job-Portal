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

export { createResume };
