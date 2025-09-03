import Attendance from "../models/attendance/attendance.schema";
import IAttendance from "../models/attendance/attendance.Interface";

const attendanceRepository = {
  createAttendance: (attendanceData: IAttendance) => Attendance.create(attendanceData),
  updateOne: (attendanceData: any) => Attendance.updateOne(attendanceData),
  findAttendance: (filter: any) => Attendance.findOne(filter),
};

export default attendanceRepository;
