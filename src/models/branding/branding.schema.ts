import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import IBranding from "./branding.interface";
import { brandingStatus, researchCategory, brandingLevel } from "./branding.interface";

const brandingSchema = new Schema<IBranding>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [brandingStatus.Approved, brandingStatus.Rejected, brandingStatus.Pending],
      default: brandingStatus.Pending,
      required: true,
    },
    research: {
      type: String,
      enum: [researchCategory.website, researchCategory.mobile, researchCategory.game, researchCategory.ui, researchCategory.data, researchCategory.other],
      required: true,
    },
    level: {
      type: String,
      enum: [brandingLevel.Beginner, brandingLevel.Intermediate, brandingLevel.Advanced],
      required: true,
    },
  },
  { timestamps: true }
);

const Branding = model<IBranding>("Branding", brandingSchema);

export default Branding;
