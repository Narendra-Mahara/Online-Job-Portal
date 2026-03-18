import { model, Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personalInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      linkedIn: String,
      github: String,
    },

    summary: {
      type: String,
      trim: true,
      maxLength: 500,
    },

    education: [
      {
        institution: {
          type: String,
          trim: true,
        },
        degree: {
          type: String,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          trim: true,
        },
        grade: { type: String },
        startYear: String,
        endYear: String,
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
        },
        role: {
          type: String,
          trim: true,
        },
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: String,
        link: String,
      },
    ],
  },
  { timestamps: true },
);

export const Resume = model("Resume", resumeSchema);
