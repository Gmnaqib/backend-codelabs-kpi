import IOperationalRecord from "../models/operationalRecord/operational.interface";
import operationalRepository from "../repository/operationalRecord.repository";
import userRepository from "../repository/user.repository";
import { ScheduleType } from "../models/schedule/schedule.interface";

const operationalRecordService = {
  createOperationalRecord: async (recordData: IOperationalRecord): Promise<IOperationalRecord> => {
    const existingRecord = await operationalRepository.findDuplicateRecord(recordData.userId.toString(), recordData.type, recordData.date);

    if (existingRecord) {
      throw new Error(`Operational record already exists for user ${recordData.userId} on ${recordData.date} with type ${recordData.type}`);
    }

    const newRecord = await operationalRepository.createRecord(recordData);
    return newRecord;
  },

  getAllOperationalRecords: async (filters?: { userId?: string; type?: ScheduleType; startDate?: Date; endDate?: Date; date?: Date }): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsWithFilters(filters || {});
    return records;
  },

  getOperationalRecordById: async (recordId: string): Promise<IOperationalRecord | null> => {
    const record = await operationalRepository.findRecordById(recordId);
    return record;
  },

  getOperationalRecordsByUserId: async (userId: string): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByUserId(userId);
    return records;
  },

  getOperationalRecordsByType: async (type: ScheduleType): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByType(type);
    return records;
  },

  getOperationalRecordsByDate: async (date: Date): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByDate(date);
    return records;
  },

  getOperationalRecordsByDateRange: async (startDate: Date, endDate: Date): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByDateRange(startDate, endDate);
    return records;
  },

  updateOperationalRecord: async (recordId: string, updateData: Partial<IOperationalRecord>): Promise<IOperationalRecord | null> => {
    const existingRecord = await operationalRepository.findRecordById(recordId);
    if (!existingRecord) {
      throw new Error("Operational record not found");
    }

    if (updateData.userId || updateData.type || updateData.date) {
      const userId = updateData.userId || existingRecord.userId;
      const type = updateData.type || existingRecord.type;
      const date = updateData.date || existingRecord.date;

      const isChangingKey =
        (updateData.userId && updateData.userId.toString() !== existingRecord.userId.toString()) ||
        (updateData.type && updateData.type !== existingRecord.type) ||
        (updateData.date && updateData.date.getTime() !== existingRecord.date.getTime());

      if (isChangingKey) {
        const duplicateRecord = await operationalRepository.findDuplicateRecord(userId.toString(), type, date);
        if (duplicateRecord && duplicateRecord._id.toString() !== recordId) {
          throw new Error(`Operational record already exists for user ${userId} on ${date} with type ${type}`);
        }
      }
    }

    const updatedRecord = await operationalRepository.updateRecordById(recordId, updateData);
    return updatedRecord;
  },

  deleteOperationalRecord: async (recordId: string): Promise<IOperationalRecord | null> => {
    const record = await operationalRepository.deleteRecordById(recordId);
    return record;
  },

  getOperationalRecordsCount: async (filters?: { userId?: string; type?: ScheduleType; startDate?: Date; endDate?: Date; date?: Date }): Promise<number> => {
    return operationalRepository.countRecordsWithFilters(filters || {});
  },

  checkOperationalRecordExists: async (userId: string, type: ScheduleType, date: Date): Promise<boolean> => {
    const exists = await operationalRepository.recordExists(userId, type, date);
    return !!exists;
  },
};

export default operationalRecordService;
