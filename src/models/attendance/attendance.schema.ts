import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import IAttendance from "./attendance.Interface";

const attendanceSchema = new Schema<IAttendance>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "sick", "leave", "absent"],
    default: "present",
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  leaveRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveRequest",
  },
});

const Attendance = model("Attendance", attendanceSchema);
export default Attendance;
