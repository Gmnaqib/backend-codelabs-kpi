import { Schema, model } from "mongoose";
import IAttendance from "./attendanceInterface"; 

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
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  tanggal: {
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
  reason: {
    type: String,
    default: "",
  },
  buktiImageLink: {
    type: String,
    default: "",
  },
}, { timestamps: true });


attendanceSchema.pre("save", function(next) {
  if (this.status === attendanceStatus.EXCUSE || this.status === attendanceStatus.SICK) {
    if (!this.reason) {
      return next(new Error("Reason is required for sick or excuse"));
    }

    if (!this.buktiImageLink) {
      return next(new Error("Image link is required for sick or excuse"));
    }
  }

  next();
});

const attendance = model("attendance", attendanceSchema);

export { attendance, attendanceStatus, approvalStatus, attendanceSchema };
