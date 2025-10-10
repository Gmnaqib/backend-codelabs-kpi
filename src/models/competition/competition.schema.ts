import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import ICompetition from "./competition.interface";
import { CompetitionStatus, CompetitionType } from "./competition.interface";

const competitionSchema = new Schema<ICompetition>(
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
    deadline: {
      type: Date,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [CompetitionStatus.Approved, CompetitionStatus.Rejected, CompetitionStatus.Pending],
      default: CompetitionStatus.Pending,
      required: true,
    },
    type: {
      type: String,
      enum: [CompetitionType.National, CompetitionType.International],
      required: true,
    },
  },
  { timestamps: true }
);

const Competition = model<ICompetition>("Competition", competitionSchema);

export default Competition;
