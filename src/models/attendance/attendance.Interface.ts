import { Types } from "mongoose";

interface IAttendance {
  userId: Types.ObjectId;
  date?: Date;
  status?: attendanceStatus;
  checkIn?: Date;
  checkOut?: Date | null;
  reason?: string;
  leaveRequestId?: Types.ObjectId;
}

export enum attendanceStatus {
  PRESENT = "present",
  SICK = "sick",
  LEAVE = "leave",
  ABSENT = "absent",
}

export default IAttendance;
