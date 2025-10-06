import leaveRequestRepository from "../repository/leave.request.repository";
import { Types } from "mongoose";
import { attendanceType, approvalStatus } from "../models/attendance/leave.request.interface";

export const leaveRequestValidate = {
  reviewLeaveRequest: async (reviewerUserId: string, requestId: string, approvalStatus: approvalStatus): Promise<void> => {
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

    const searchLeaveRequest = await leaveRequestRepository.findLeaveRequestById(requestId);

    if (!searchLeaveRequest) {
      throw new Error("Leave request not found");
    }

    if (searchLeaveRequest.approvalStatus === "approved" || searchLeaveRequest.approvalStatus === "rejected") {
      throw new Error("Leave request has already been reviewed");
    }
  },
};

export default leaveRequestValidate;
