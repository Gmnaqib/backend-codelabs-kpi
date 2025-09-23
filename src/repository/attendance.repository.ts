import Attendance from "../models/attendance/attendance.schema";
import IAttendance from "../models/attendance/attendance.Interface";
import mongoose from "mongoose";

const attendanceRepository = {
  createAttendance: (attendanceData: IAttendance) => Attendance.create(attendanceData),
  updateOne: (attendanceData: any) => Attendance.updateOne(attendanceData),
  findAttendance: (filter: any) => Attendance.findOne(filter),
  findAll: () => Attendance.find().sort({ date: 1 }),
  findMonthlyAttendance: (month: number, year: number, status?: string) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    const filter: any = { date: { $gte: start, $lte: end } };
    if (status) filter.status = status;

    return Attendance.find(filter).sort({ date: 1 });
  },

  getMonthlySummary: (year: number, month: number) => {
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

  getSummary: () => {
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

  findDetailsByStatus: (userId: string, status: string, year: number, month: number) => {
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Attendance.find({
      userId: new mongoose.Types.ObjectId(userId),
      status,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });
  },
  getSummaryWithDates: (userId: string) => {
    return Attendance.aggregate([
      { $match: { userId } },
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
};

export default attendanceRepository;
