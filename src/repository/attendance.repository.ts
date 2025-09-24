import Attendance from "../models/attendance/attendance.schema";
import IAttendance, { attendanceStatus } from "../models/attendance/attendance.Interface";
import { Types } from "mongoose";

interface AttendanceFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  date?: Date | { $gte?: Date; $lte?: Date; $lt?: Date };
  status?: attendanceStatus;
  checkIn?: Date | { $gte?: Date; $lte?: Date; $lt?: Date };
  checkOut?: Date | { $gte?: Date; $lte?: Date; $lt?: Date } | null;
  reason?: string;
  leaveRequestId?: Types.ObjectId;
}

const attendanceRepository = {
  createAttendance: (attendanceData: Partial<IAttendance>) => Attendance.create(attendanceData),

  findAllAttendances: () => Attendance.find().sort({ date: 1 }),

  findAttendanceById: (id: string) => Attendance.findById(id),

  findAttendance: (filter: AttendanceFilter) => Attendance.findOne(filter),

  findAttendancesByFilter: (filter: AttendanceFilter) => Attendance.find(filter).sort({ date: 1 }),

  findAttendancesByUserId: (userId: string) => Attendance.find({ userId: new Types.ObjectId(userId) }).sort({ date: 1 }),

  findMonthlyAttendances: (month: number, year: number) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);
    return Attendance.find({ date: { $gte: start, $lte: end } }).sort({ date: 1 });
  },

  findAttendancesByDateRange: (startDate: Date, endDate: Date, userId?: string) => {
    const filter: AttendanceFilter = { date: { $gte: startDate, $lte: endDate } };
    if (userId) filter.userId = new Types.ObjectId(userId);
    return Attendance.find(filter).sort({ date: 1 });
  },

  findAttendanceDetailsByStatus: (userId: string, status: string, month: number, year: number) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);
    return Attendance.find({
      userId: new Types.ObjectId(userId),
      status,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });
  },

  // Update operations
  updateAttendanceById: (id: string, updateData: Partial<IAttendance>) => Attendance.findByIdAndUpdate(id, updateData, { new: true }),

  updateAttendance: (filter: AttendanceFilter, updateData: Partial<IAttendance>) => Attendance.updateOne(filter, updateData),

  // Delete operations
  deleteAttendanceById: (id: string) => Attendance.findByIdAndDelete(id),

  deleteAttendance: (filter: AttendanceFilter) => Attendance.deleteOne(filter),
};

export default attendanceRepository;
