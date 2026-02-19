import { Schema, model } from "mongoose";
import IResearch, {
  statusResearch,
  CategoryType,
  progressStatus,
} from "./research.interface";

const researchSchema = new Schema<IResearch>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    week: { type: Number, required: true },
    category: {
      type: String,
      enum: Object.values(CategoryType),
      required: true,
    },
    research_type: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    progress: {
      type: String,
      enum: Object.values(progressStatus),
      required: true,
    },
    challenge: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(statusResearch),
      default: "pending",
    },
  },
  { timestamps: true },
);

const Research = model<IResearch>("Research", researchSchema);

export default Research;
