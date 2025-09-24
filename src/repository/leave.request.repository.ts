import LeaveRequest from "../models/attendance/leave.request.schema";
import IleaveRequest, { attendanceType, approvalStatus } from "../models/attendance/leave.request.interface";
import { Types } from "mongoose";

interface LeaveRequestFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  type?: attendanceType;
  approvalStatus?: approvalStatus;
  approvedBy?: Types.ObjectId | string;
  startDate?: Date | { $gte?: Date; $lte?: Date };
  endDate?: Date | { $gte?: Date; $lte?: Date };
}

const leaveRequestRepository = {
  createLeaveRequest: (leaveRequestData: Partial<IleaveRequest>) => LeaveRequest.create(leaveRequestData),

  findAllLeaveRequests: () => LeaveRequest.find().sort({ createdAt: -1 }),

  findLeaveRequestById: (id: string) => LeaveRequest.findById(id),

  findLeaveRequest: (filter: LeaveRequestFilter) => LeaveRequest.findOne(filter),

  findLeaveRequestsByFilter: (filter: LeaveRequestFilter) => LeaveRequest.find(filter).sort({ createdAt: -1 }),

  findLeaveRequestsByUserId: (userId: string) => LeaveRequest.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }),

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
    }).sort({ createdAt: -1 }),

  findTodayLeaveRequests: (todayStart: Date, todayEnd: Date) =>
    LeaveRequest.find({
      $and: [{ startDate: { $lte: todayEnd } }, { endDate: { $gte: todayStart } }],
    }).sort({ createdAt: -1 }),

  updateLeaveRequestById: (id: string, updateData: Partial<IleaveRequest>) => LeaveRequest.findByIdAndUpdate(id, updateData, { new: true }),

  updateLeaveRequest: (filter: LeaveRequestFilter, updateData: Partial<IleaveRequest>) => LeaveRequest.updateOne(filter, updateData),

  deleteLeaveRequestById: (id: string) => LeaveRequest.findByIdAndDelete(id),

  deleteLeaveRequest: (filter: LeaveRequestFilter) => LeaveRequest.deleteOne(filter),
};

export default leaveRequestRepository;
