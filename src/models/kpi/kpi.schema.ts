import mongoose, { Schema, model } from "mongoose";
import IKPI from "./kpi.interface";

const kpiSchema = new Schema<IKPI>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendance: {
    type: Number,
    required: true,
  },
  research: {
    type: Number,
    required: true,
  },
  competition: {
    type: Number,
    required: true,
  },
  operational: {
    type: Number,
    required: true,
  },
  branding: {
    type: Number,
    required: true,
  },
});

const KPI = model<IKPI>("KPI", kpiSchema);

export default KPI;
