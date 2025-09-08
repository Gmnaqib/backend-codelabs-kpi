import { Types } from "mongoose";

interface IleaveRequest {
  userId: Types.ObjectId;
  type: "sick" | "leave";
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
