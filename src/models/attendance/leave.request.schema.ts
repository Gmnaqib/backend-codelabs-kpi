import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { approvalStatus } from "./leave.request.interface";

const leaveRequestSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["sick", "leave"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    attachmentUrl: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(approvalStatus),
      default: approvalStatus.PENDING,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const LeaveRequest = model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
