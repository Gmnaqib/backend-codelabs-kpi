import attendanceRepository from "../repository/attendance.repository";
import { Types } from "mongoose";
import { approvalStatus } from "../models/attendance/attendance.Interface";

export const leaveRequestValidate = {
  reviewLeaveRequest: async (reviewerUserId: Types.ObjectId, requestId: Types.ObjectId, approvalStatus: approvalStatus): Promise<void> => {
    if (!reviewerUserId) {
      throw new Error("Reviewer user ID is required");
    }

    if (!requestId) {
      throw new Error("Request ID is required");
    }

    if (!approvalStatus) {
      throw new Error("Approval status is required");
    }

    // Basic ID format validation
    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error("Invalid request ID format");
    }

    if (!Types.ObjectId.isValid(reviewerUserId)) {
      throw new Error("Invalid reviewer user ID format");
    }

    // Validate approval status
    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      throw new Error("Invalid approval status");
    }

    const searchLeaveRequest = await attendanceRepository.findById(requestId);

    if (!searchLeaveRequest) {
      throw new Error("Leave request not found");
    }

    if (searchLeaveRequest.approval_status === "approved" || searchLeaveRequest.approval_status === "rejected") {
      throw new Error("Leave request has already been reviewed");
    }
  },
};

export default leaveRequestValidate;
