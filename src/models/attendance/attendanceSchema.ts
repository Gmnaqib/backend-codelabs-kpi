import { Schema, model } from 'mongoose';
import IAttendance from './attendanceInterface';
import mongoose from 'mongoose';

const attendanceSchema = new Schema<IAttendance>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'sick', 'leave', 'absent'],
    default: 'present',
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending',
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  reason: {
    type: String,
    required: false,
  },
  proveImage: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
});

attendanceSchema.pre('save', function (this: IAttendance, next) {
  if (this.status === 'leave' || this.status === 'sick') {
    if (!this.reason) {
      return next(new Error('Reason is required for sick or leave'));
    }

    if (!this.proveImage) {
      return next(new Error('Image link is required for sick or leave'));
    }

    if (!this.startDate) {
      return next(new Error('start date is required for sick or leave'));
    }

    if (!this.endDate) {
      return next(new Error('end date is required for sick or leave'));
    }
  }

  next();
});

const Attendance = model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;
