import mongoose, { Schema, model } from "mongoose";
import IKPI from "./kpi.interface";

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
    attendance: {
      type: Number,
      required: true,
      default: 0,
    },
    research: {
      type: Number,
      required: true,
      default: 0,
    },
    competition: {
      type: Number,
      required: true,
      default: 0,
    },
    operational: {
      type: Number,
      required: true,
      default: 0,
    },
    branding: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create unique index for userId, month, year combination
kpiSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const KPI = model<IKPI>("KPI", kpiSchema);

export default KPI;
