import mongoose, { Schema, model } from "mongoose";
import IKPI, { IKPIScoring } from "./kpi.interface";

const kpiScoringSchema = new Schema<IKPIScoring>(
  {
    activity: {
      type: String,
      required: true,
      enum: ["Picker", "Attendance", "Thematic", "Research", "Competition", "Branding"],
    },
    detail: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const kpiSchema = new Schema<IKPI>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    scoring: {
      type: [kpiScoringSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// Create unique index for userId, month, year combination
kpiSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const KPI = model<IKPI>("KPI", kpiSchema);

export default KPI;
