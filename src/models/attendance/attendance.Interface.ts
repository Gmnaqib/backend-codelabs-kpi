import { Types } from 'mongoose';

interface IAttendance {
  userId: Types.ObjectId;
  status?: attendanceStatus;
  approvalStatus?: approvalStatus;
  reason?: string;
  proveImage?: string;
  checkIn?: Date;
  checkOut?: Date | null;
  startDate?: Date;
  endDate?: Date;
}

enum attendanceStatus {
  PRESENT = 'present',
  SICK = 'sick',
  LEAVE = 'leave',
  ABSENT = 'absent',
}

export enum approvalStatus {
  PENDING = 'pending',
  ACCEPT = 'accept',
  REJECT = 'reject',
}
export default IAttendance;
