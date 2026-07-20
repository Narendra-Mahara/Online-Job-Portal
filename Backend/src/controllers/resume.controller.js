import { Resume } from "../models/resume.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

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

const getResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    if (resumes.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No resume found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "Successfully fetched resume"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal server error"));
  }
};

const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    if (!resumeId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Resume id is required"));
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

    if (!resume) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Successfully fetched resume"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
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

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    const parser = new PDFParse({
      data: req.file.buffer,
    });

    const result = await parser.getText();
    await parser.destroy();
    const resumeText = result.text;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `
Extract the following resume into the EXACT JSON schema.

Rules:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Every field must exist.
- Missing values should be "".
- Missing arrays should be [].

Schema:

{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "address": "",
    "linkedIn": "",
    "github": ""
  },
  "summary": "",
  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "grade": "",
      "startYear": "",
      "endYear": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": [""],
  "projects": [
    {
      "title": "",
      "description": "",
      "link": ""
    }
  ]
}

Resume:

${resumeText}
`;
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
    });

    const jsonText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedResume = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      message: "Resume extracted successfully.",
      data: extractedResume,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { createResume, deleteResume, getResume, getResumeById, uploadResume };
