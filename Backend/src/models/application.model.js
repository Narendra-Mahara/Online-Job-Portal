import { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// prevent duplicate applications
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

export const Application = model("Application", applicationSchema);
