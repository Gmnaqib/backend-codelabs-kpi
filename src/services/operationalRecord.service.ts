import IOperationalRecord from "../models/operationalRecord/operational.interface";
import operationalRepository from "../repository/operationalRecord.repository";
import scheduleRepository from "../repository/schedule.repository";
import { ScheduleType } from "../models/schedule/schedule.interface";

const operationalRecordService = {
  createOperationalRecord: async (recordData: IOperationalRecord): Promise<IOperationalRecord> => {
    const scheduleId = recordData.scheduleId;
    const userId = recordData.userId;

    if (scheduleId) {
      const existingRecord = await operationalRepository.findDuplicateRecord(scheduleId, userId);
      const findScheduleById = await scheduleRepository.findScheduleById(scheduleId);

      if (!findScheduleById) {
        throw new Error("Schedule not found");
      }

      const isUserAssignedToSchedule = findScheduleById.assignedUsers?.some((user: any) => user._id.toString() === recordData.userId.toString());

      if (!isUserAssignedToSchedule) {
        throw new Error("User is not assigned to this schedule");
      }

      if (existingRecord) {
        throw new Error(`Operational record already exists for this schedule and user`);
      }
      const newRecord = await operationalRepository.createRecord(recordData);
      return newRecord;
    }

    const newRecord = await operationalRepository.createRecord(recordData);
    return newRecord;
  },

  getAllOperationalRecords: async (filters?: {
    scheduleId?: string;
    userId?: string;
    type?: ScheduleType;
    startDate?: Date;
    endDate?: Date;
    date?: Date;
    status?: string;
  }): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsWithFilters(filters || {});
    return records;
  },

  getOperationalRecordById: async (recordId: string): Promise<IOperationalRecord | null> => {
    const record = await operationalRepository.findRecordById(recordId);
    return record;
  },

  getOperationalRecordsByScheduleId: async (scheduleId: string): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByScheduleId(scheduleId);
    return records;
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

  getOperationalRecordsByStatus: async (status: string): Promise<IOperationalRecord[]> => {
    const records = await operationalRepository.findRecordsByStatus(status);
    return records;
  },

  // updateOperationalRecord: async (recordId: string, updateData: Partial<IOperationalRecord>): Promise<IOperationalRecord | null> => {
  //   const existingRecord = await operationalRepository.findRecordById(recordId);
  //   if (!existingRecord) {
  //     throw new Error("Operational record not found");
  //   }

  //   if (updateData.scheduleId || updateData.userId) {
  //     const scheduleId = updateData.scheduleId || existingRecord.scheduleId;
  //     const userId = updateData.userId || existingRecord.userId;

  //     const isChangingKey =
  //       (updateData.scheduleId && updateData.scheduleId.toString() !== existingRecord.scheduleId?.toString()) ||
  //       (updateData.userId && updateData.userId.toString() !== existingRecord.userId.toString());

  //     if (isChangingKey) {
  //       const duplicateRecord = await operationalRepository.findDuplicateRecord(scheduleId?.toString() || "", userId.toString());
  //       if (duplicateRecord && duplicateRecord._id.toString() !== recordId) {
  //         throw new Error(`Operational record already exists for this schedule and user`);
  //       }
  //     }
  //   }

  //   const updatedRecord = await operationalRepository.updateRecordById(recordId, updateData);
  //   return updatedRecord;
  // },

  deleteOperationalRecord: async (recordId: string): Promise<IOperationalRecord | null> => {
    const record = await operationalRepository.deleteRecordById(recordId);
    return record;
  },

  getOperationalRecordsCount: async (filters?: { scheduleId?: string; userId?: string; type?: ScheduleType; startDate?: Date; endDate?: Date; date?: Date; status?: string }): Promise<number> => {
    return operationalRepository.countRecordsWithFilters(filters || {});
  },

  checkOperationalRecordExists: async (scheduleId: string, userId: string): Promise<boolean> => {
    const exists = await operationalRepository.recordExists(scheduleId, userId);
    return !!exists;
  },
};

export default operationalRecordService;
