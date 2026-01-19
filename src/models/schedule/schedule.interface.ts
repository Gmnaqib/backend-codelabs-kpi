import { Types } from "mongoose";

interface ISchedule {
  type: ScheduleType;
  date: Date;
  assignedUsers?: Types.ObjectId[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ScheduleType {
  picket = "picket",
  thematic = "thematic",
}

export default ISchedule;
