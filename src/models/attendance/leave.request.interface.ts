import { Types } from "mongoose";

export type attendanceType = "sick" | "leave";

interface IleaveRequest {
  userId: Types.ObjectId;
  type: attendanceType;
  reason: string;
  attachmentUrl: string;
  startDate: Date;
  endDate: Date;
  approvalStatus?: approvalStatus;
  approvedBy?: Types.ObjectId | null;
}

export enum approvalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export default IleaveRequest;
