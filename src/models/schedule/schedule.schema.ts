import mongoose, { Schema } from "mongoose";
import ISchedule from "./schedule.interface";

const ScheduleSchema = new Schema<ISchedule>(
  {
    type: { type: String, enum: ["picket", "thematic"], required: true },
    date: { type: Date, required: true },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: { type: String },
  },
  { timestamps: true },
);

// Validasi tanggal harus Senin-Jumat
ScheduleSchema.pre("save", function (next) {
  const dayOfWeek = this.date.getDay();
  // 0 = Minggu, 1 = Senin, ..., 5 = Jumat, 6 = Sabtu
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    throw new Error("Schedule date must be Monday to Friday only");
  }
  next();
});

export const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);
export default Schedule;
