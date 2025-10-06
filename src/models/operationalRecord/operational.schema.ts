import mongoose, { Schema } from "mongoose";
import IOperationalRecord from "./operational.interface";
import { ScheduleType } from "../schedule/schedule.interface";

const operationalRecordSchema = new Schema<IOperationalRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: Object.values(ScheduleType), required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const OperationalRecord = mongoose.model<IOperationalRecord>("OperationalRecord", operationalRecordSchema);

export default OperationalRecord;
