import Attendance from "../models/attendance/attendance.schema";
import IAttendance from "../models/attendance/attendance.Interface";
import { Types } from "mongoose";

// Type-safe filter interfaces
interface AttendanceFilter {
  userId?: Types.ObjectId | string;
  date?: Date | { $gte?: Date; $lte?: Date; $lt?: Date };
  status?: string;
  checkIn?: Date | { $gte?: Date; $lte?: Date; $lt?: Date };
  checkOut?: Date | { $gte?: Date; $lte?: Date; $lt?: Date } | null;
  leaveRequestId?: Types.ObjectId;
}

interface AttendanceUpdate {
  userId?: Types.ObjectId;
  date?: Date;
  status?: string;
  checkIn?: Date;
  checkOut?: Date | null;
  reason?: string;
  leaveRequestId?: Types.ObjectId;
}

const attendanceRepository = {
  createAttendance: (attendanceData: Partial<IAttendance>) => Attendance.create(attendanceData),
  updateAttendance: (filter: AttendanceFilter, updateData: AttendanceUpdate) => Attendance.updateOne(filter, updateData),
  findAttendance: (filter: AttendanceFilter) => Attendance.findOne(filter),
  findAllAttendances: () => Attendance.find().sort({ date: 1 }),
  findAttendancesByFilter: (filter: AttendanceFilter) => Attendance.find(filter).sort({ date: 1 }),

  findMonthlyAttendances: (month: number, year: number, status?: string) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    const filter: AttendanceFilter = { date: { $gte: start, $lte: end } };
    if (status) filter.status = status;

    return Attendance.find(filter).sort({ date: 1 });
  },

  // rekap absensi bulanan per user
  getAttendanceMonthlySummary: (year: number, month: number) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Attendance.aggregate([
      {
        $match: { date: { $gte: start, $lte: end } },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            status: "$status",
          },
          total: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.userId",
          counts: {
            $push: { status: "$_id.status", total: "$total" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          counts: {
            $arrayToObject: {
              $map: {
                input: "$counts",
                as: "c",
                in: ["$$c.status", "$$c.total"],
              },
            },
          },
        },
      },
    ]);
  },

  getAttendanceSummary: () => {
    return Attendance.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            status: "$status",
          },
          total: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.userId",
          counts: {
            $push: { status: "$_id.status", total: "$total" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          counts: {
            $arrayToObject: {
              $map: {
                input: "$counts",
                as: "c",
                in: ["$$c.status", "$$c.total"],
              },
            },
          },
        },
      },
    ]);
  },

  findAttendanceDetailsByStatus: (userId: string, status: string, year: number, month: number) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Attendance.find({
      userId: new Types.ObjectId(userId),
      status,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });
  },

  getAttendanceSummaryWithDates: (userId: string) => {
    return Attendance.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          dates: { $push: "$date" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          dates: 1,
        },
      },
    ]);
  },

  deleteAttendance: (id: string) => Attendance.findByIdAndDelete(id),
};

export default attendanceRepository;
