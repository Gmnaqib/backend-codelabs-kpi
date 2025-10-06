import Schedule from "../models/schedule/schedule.schema";
import ISchedule, { ScheduleType } from "../models/schedule/schedule.interface";
import { Types } from "mongoose";

// Type-safe filter interface using proper enums
interface ScheduleFilter {
  _id?: Types.ObjectId | string;
  type?: ScheduleType;
  date?: Date | { $gte?: Date; $lte?: Date; $lt?: Date };
  description?: string;
}

const scheduleRepository = {
  createSchedule: (scheduleData: Partial<ISchedule>) => Schedule.create(scheduleData),
  findAllSchedules: () => Schedule.find().sort({ createdAt: -1 }),
  findScheduleById: (id: string) => Schedule.findById(id),
  findSchedule: (filter: ScheduleFilter) => Schedule.findOne(filter),
  findSchedulesByFilter: (filter: ScheduleFilter) => Schedule.find(filter).sort({ createdAt: -1 }),
  findSchedulesByType: (type: ScheduleType) => Schedule.find({ type }).sort({ createdAt: -1 }),
  findSchedulesByDate: (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Schedule.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });
  },

  findSchedulesByDateRange: (startDate: Date, endDate: Date) =>
    Schedule.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 }),

  findPicketSchedules: () => Schedule.find({ type: ScheduleType.picket }).sort({ createdAt: -1 }),

  findThematicSchedules: () => Schedule.find({ type: ScheduleType.thematic }).sort({ date: 1 }),

  findActiveThematicSchedules: (currentDate: Date) => {
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    return Schedule.find({
      type: ScheduleType.thematic,
      date: { $gte: startOfDay },
    }).sort({ date: 1 });
  },

  updateScheduleById: (id: string, updateData: Partial<ISchedule>) => Schedule.findByIdAndUpdate(id, updateData, { new: true }),
  updateSchedule: (filter: ScheduleFilter, updateData: Partial<ISchedule>) => Schedule.updateOne(filter, updateData),
  deleteScheduleById: (id: string) => Schedule.findByIdAndDelete(id),
  deleteSchedule: (filter: ScheduleFilter) => Schedule.deleteOne(filter),
};

export default scheduleRepository;
