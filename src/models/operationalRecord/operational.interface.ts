import { ScheduleType } from "../schedule/schedule.interface";
import { Types } from "mongoose";

interface IOperationalRecord {
  scheduleId: Types.ObjectId;
  userId: Types.ObjectId;
  type: ScheduleType;
  date: Date;
}

export default IOperationalRecord;
