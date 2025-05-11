import Attendance from '../models/attendance/attendanceSchema';
import IAttendance from '../models/attendance/attendanceInterface';

const attendanceRepository = {
  createAttendance: (attendanceData: IAttendance) => Attendance.create(attendanceData),
  updateOne: (attendanceData: any) => Attendance.updateOne(attendanceData),
  findAttendance: (filter: any) => Attendance.findOne(filter),
};

export default attendanceRepository;
