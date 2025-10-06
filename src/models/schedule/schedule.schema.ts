import mongoose, { Schema } from "mongoose";
import ISchedule from "./schedule.interface";

const ScheduleSchema = new Schema<ISchedule>(
  {
    type: { type: String, enum: ["picket", "thematic"], required: true },
    date: { type: Date },
    days: {
      type: Object,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);
export default Schedule;
