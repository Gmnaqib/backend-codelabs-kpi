import { Schema, model } from "mongoose";
import IAttendance from "./attendanceInterface"; 
import mongoose from "mongoose";

enum attendanceStatus {
  PRESENT = "present",
  SICK = "sick",
  EXCUSE = "excuse",
  ABSENT = "absent",
}

enum approvalStatus {
  PENDING = "pending", 
  ACCEPT = "accept",         
  REJECT = "reject",  
}

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
    enum: Object.values(attendanceStatus),
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: Object.values(approvalStatus),
    default: approvalStatus.PENDING, 
  },
  checkIn: {
    type: Date
  },
   checkOut: {
    type: Date
  },
  reason: {
    type: String,
    required:false,
  },
  proveImage: {
    type: String,
    required: false,
  },
});


attendanceSchema.pre("save", function(next) {
  if (this.status === attendanceStatus.EXCUSE || this.status === attendanceStatus.SICK) {
    if (!this.reason) {
      return next(new Error("Reason is required for sick or excuse"));
    }

    if (!this.proveImage) {
      return next(new Error("Image link is required for sick or excuse"));
    }
  }

  next();
});

// const attendance = model("attendance", attendanceSchema);
const Attendance = model<IAttendance>("Attendace", attendanceSchema);
// export default Attendance;

export { Attendance, attendanceStatus, approvalStatus, attendanceSchema };
