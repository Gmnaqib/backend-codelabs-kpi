import { Request, Response } from "express";
import operationalRecordService from "../services/operationalRecord.service";
import response from "../helper/response";
import IOperationalRecord from "../models/operationalRecord/operational.interface";
import { ScheduleType } from "../models/schedule/schedule.interface";
import { Types } from "mongoose";

const operationalRecordController = {
  createOperationalRecord: async (req: Request, res: Response): Promise<any> => {
    try {
      const { scheduleId, userId, type, date } = req.body;

      if (!userId || !type || !date) {
        return response({
          res,
          code: 400,
          message: "Missing required fields: userId, type, and date are required",
        });
      }

      if (!Object.values(ScheduleType).includes(type)) {
        return response({
          res,
          code: 400,
          message: `Invalid type. Must be one of: ${Object.values(ScheduleType).join(", ")}`,
        });
      }

      // If type is picket, scheduleId is required
      if (type === "picket" && !scheduleId) {
        return response({
          res,
          code: 400,
          message: "scheduleId is required when type is picket",
        });
      }

      // Validate scheduleId if provided
      if (scheduleId && !Types.ObjectId.isValid(scheduleId)) {
        return response({
          res,
          code: 400,
          message: "Invalid scheduleId format",
        });
      }

      if (!Types.ObjectId.isValid(userId)) {
        return response({
          res,
          code: 400,
          message: "Invalid userId format",
        });
      }

      const recordData: IOperationalRecord = {
        scheduleId: scheduleId ? new Types.ObjectId(scheduleId) : undefined,
        userId: new Types.ObjectId(userId),
        type,
        date: new Date(date),
      } as IOperationalRecord;

      if (isNaN(recordData.date.getTime())) {
        return response({
          res,
          code: 400,
          message: "Invalid date format",
        });
      }

      // Validate date is Monday-Friday
      const dayOfWeek = recordData.date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return response({
          res,
          code: 400,
          message: "Date must be Monday to Friday only",
        });
      }

      const newRecord = await operationalRecordService.createOperationalRecord(recordData);

      return response({
        res,
        code: 201,
        message: "Operational record created successfully",
        data: newRecord,
      });
    } catch (error: any) {
      console.error("Error creating operational record:", error);
      return response({
        res,
        code: 500,
        message: error.message || "Failed to create operational record",
      });
    }
  },
  getAllOperationalRecords: async (req: Request, res: Response): Promise<any> => {
    try {
      const { scheduleId, userId, type, year, month, status } = req.query;

      const filters: any = {};

      if (scheduleId) {
        if (!Types.ObjectId.isValid(scheduleId as string)) {
          return response({
            res,
            code: 400,
            message: "Invalid scheduleId format",
          });
        }
        filters.scheduleId = scheduleId as string;
      }

      if (userId) {
        if (!Types.ObjectId.isValid(userId as string)) {
          return response({
            res,
            code: 400,
            message: "Invalid userId format",
          });
        }
        filters.userId = userId as string;
      }

      if (type) {
        if (!Object.values(ScheduleType).includes(type as ScheduleType)) {
          return response({
            res,
            code: 400,
            message: `Invalid type. Must be one of: ${Object.values(ScheduleType).join(", ")}`,
          });
        }
        filters.type = type as ScheduleType;
      }

      if (year || month) {
        const y = year ? parseInt(year as string) : new Date().getFullYear();
        const m = month ? parseInt(month as string) : new Date().getMonth() + 1;

        if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
          return response({
            res,
            code: 400,
            message: "Invalid year or month format. Month must be 1-12",
          });
        }

        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59, 999);

        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      if (status) filters.status = status as string;

      const records = await operationalRecordService.getAllOperationalRecords(filters);

      return response({
        res,
        code: 200,
        message: "Operational records retrieved successfully",
        data: records,
      });
    } catch (error: any) {
      console.error("Error getting operational records:", error);
      return response({
        res,
        code: 500,
        message: "Failed to retrieve operational records",
      });
    }
  },

  getOperationalRecordById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id as string)) {
        return response({
          res,
          code: 400,
          message: "Invalid record ID format",
        });
      }

      const record = await operationalRecordService.getOperationalRecordById(id as string);

      if (!record) {
        return response({
          res,
          code: 404,
          message: "Operational record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Operational record retrieved successfully",
        data: record,
      });
    } catch (error: any) {
      console.error("Error getting operational record:", error);
      return response({
        res,
        code: 500,
        message: "Failed to retrieve operational record",
      });
    }
  },

  deleteOperationalRecord: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id as string)) {
        return response({
          res,
          code: 400,
          message: "Invalid record ID format",
        });
      }

      const deletedRecord = await operationalRecordService.deleteOperationalRecord(id as string);

      if (!deletedRecord) {
        return response({
          res,
          code: 404,
          message: "Operational record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Operational record deleted successfully",
        data: deletedRecord,
      });
    } catch (error: any) {
      console.error("Error deleting operational record:", error);
      return response({
        res,
        code: 500,
        message: "Failed to delete operational record",
      });
    }
  },
};

export default operationalRecordController;
