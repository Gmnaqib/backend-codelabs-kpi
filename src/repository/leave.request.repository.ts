import LeaveRequest from "../models/attendance/leave.request.schema";
import IleaveRequest, { attendanceType, approvalStatus } from "../models/attendance/leave.request.interface";
import { Types } from "mongoose";

// Type-safe filter and update interfaces
interface LeaveRequestFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  type?: attendanceType;
  approvalStatus?: approvalStatus;
  approvedBy?: Types.ObjectId | string;
  startDate?: Date | { $gte?: Date; $lte?: Date };
  endDate?: Date | { $gte?: Date; $lte?: Date };
}

interface LeaveRequestUpdate {
  type?: attendanceType;
  reason?: string;
  attachmentUrl?: string;
  startDate?: Date;
  endDate?: Date;
  approvalStatus?: approvalStatus;
  approvedBy?: Types.ObjectId | string;
}

const leaveRequestRepository = {
  createLeaveRequest: (leaveRequestData: Partial<IleaveRequest>) => LeaveRequest.create(leaveRequestData),

  findAllLeaveRequests: () => LeaveRequest.find().sort({ createdAt: -1 }),

  findLeaveRequestById: (id: string) => LeaveRequest.findById(id),

  findLeaveRequest: (filter: LeaveRequestFilter) => LeaveRequest.findOne(filter),

  findLeaveRequestsByFilter: (filter: LeaveRequestFilter) => LeaveRequest.find(filter).sort({ createdAt: -1 }),

  updateLeaveRequest: (filter: LeaveRequestFilter, updateData: LeaveRequestUpdate) => LeaveRequest.updateOne(filter, updateData),

  updateLeaveRequestById: (id: string, updateData: LeaveRequestUpdate) => LeaveRequest.findByIdAndUpdate(id, updateData, { new: true }),

  deleteLeaveRequest: (id: string) => LeaveRequest.findByIdAndDelete(id),

  deleteLeaveRequestByFilter: (filter: LeaveRequestFilter) => LeaveRequest.deleteOne(filter),

  // Specific helper methods
  findLeaveRequestsByUser: (userId: string) => LeaveRequest.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }),

  findPendingLeaveRequests: () => LeaveRequest.find({ approvalStatus: approvalStatus.PENDING }).sort({ createdAt: -1 }),

  findLeaveRequestsByStatus: (status: approvalStatus) => LeaveRequest.find({ approvalStatus: status }).sort({ createdAt: -1 }),

  findLeaveRequestsByDateRange: (startDate: Date, endDate: Date) =>
    LeaveRequest.find({
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
        },
      ],
    }),

  approveLeaveRequest: (id: string, approvedBy: string) =>
    LeaveRequest.findByIdAndUpdate(
      id,
      {
        approvalStatus: approvalStatus.APPROVED,
        approvedBy: new Types.ObjectId(approvedBy),
      },
      { new: true }
    ),

  rejectLeaveRequest: (id: string, approvedBy: string) =>
    LeaveRequest.findByIdAndUpdate(
      id,
      {
        approvalStatus: approvalStatus.REJECTED,
        approvedBy: new Types.ObjectId(approvedBy),
      },
      { new: true }
    ),
};

export default leaveRequestRepository;
