import OperationalRecord from "../models/operationalRecord/operational.schema";
import IOperationalRecord from "../models/operationalRecord/operational.interface";
import { ScheduleType } from "../models/schedule/schedule.interface";
import { Types } from "mongoose";

interface OperationalRecordFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  type?: ScheduleType;
  date?: Date | { $gte?: Date; $lte?: Date };
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
}

const operationalRecordRepository = {
  createRecord: (recordData: Partial<IOperationalRecord>) => OperationalRecord.create(recordData),
  findAllRecords: () => OperationalRecord.find().sort({ date: -1, createdAt: -1 }),
  findRecordById: (id: string) => OperationalRecord.findById(id),
  findRecordsByFilter: (filter: OperationalRecordFilter) => OperationalRecord.find(filter).sort({ date: -1, createdAt: -1 }),
  findRecordsByUserId: (userId: string) => OperationalRecord.find({ userId }).sort({ date: -1, createdAt: -1 }),
  findRecordsByType: (type: ScheduleType) => OperationalRecord.find({ type }).sort({ date: -1, createdAt: -1 }),

  findRecordsByDate: (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return OperationalRecord.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1, createdAt: -1 });
  },

  findRecordsByDateRange: (startDate: Date, endDate: Date) =>
    OperationalRecord.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1, createdAt: -1 }),

  findDuplicateRecord: (userId: string, type: ScheduleType, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return OperationalRecord.findOne({
      userId,
      type,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  },

  findRecordsWithFilters: (filters: { userId?: string; type?: ScheduleType; startDate?: Date; endDate?: Date; date?: Date }) => {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.type) query.type = filters.type;

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    return OperationalRecord.find(query).sort({ date: -1, createdAt: -1 });
  },

  updateRecordById: (id: string, updateData: Partial<IOperationalRecord>) => OperationalRecord.findByIdAndUpdate(id, updateData, { new: true }),
  updateRecord: (filter: OperationalRecordFilter, updateData: Partial<IOperationalRecord>) => OperationalRecord.updateOne(filter, updateData),
  deleteRecordById: (id: string) => OperationalRecord.findByIdAndDelete(id),
  deleteRecord: (filter: OperationalRecordFilter) => OperationalRecord.deleteOne(filter),
  countRecords: () => OperationalRecord.countDocuments(),
  countRecordsByFilter: (filter: OperationalRecordFilter) => OperationalRecord.countDocuments(filter),
  countRecordsWithFilters: (filters: { userId?: string; type?: ScheduleType; startDate?: Date; endDate?: Date; date?: Date }) => {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.type) query.type = filters.type;

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    return OperationalRecord.countDocuments(query);
  },

  recordExists: (userId: string, type: ScheduleType, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return OperationalRecord.exists({
      userId,
      type,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  },
};

export default operationalRecordRepository;
