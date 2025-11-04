import { Request, Response } from "express";
import operationalRecordService from "../services/operationalRecord.service";
import response from "../helper/response";
import IOperationalRecord from "../models/operationalRecord/operational.interface";
import { ScheduleType } from "../models/schedule/schedule.interface";
import { Types } from "mongoose";

const operationalRecordController = {
  createOperationalRecord: async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, type, date } = req.body;

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

      if (!Types.ObjectId.isValid(userId)) {
        return response({
          res,
          code: 400,
          message: "Invalid userId format",
        });
      }

      const recordData: IOperationalRecord = {
        userId: new Types.ObjectId(userId),
        type,
        date: new Date(date),
      };

      if (isNaN(recordData.date.getTime())) {
        return response({
          res,
          code: 400,
          message: "Invalid date format",
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

      if (error.message?.includes("already exists")) {
        return response({
          res,
          code: 409,
          message: error.message,
        });
      } else {
        return response({
          res,
          code: 500,
          message: "Failed to create operational record",
        });
      }
    }
  },

  getAllOperationalRecords: async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, type, date, startDate, endDate } = req.query;

      const filters: any = {};

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
      if (date) filters.date = new Date(date as string);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

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

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid record ID format",
        });
      }

      const record = await operationalRecordService.getOperationalRecordById(id);

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

  updateOperationalRecord: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid record ID format",
        });
      }

      if (updateData.type && !Object.values(ScheduleType).includes(updateData.type)) {
        return response({
          res,
          code: 400,
          message: `Invalid type. Must be one of: ${Object.values(ScheduleType).join(", ")}`,
        });
      }

      if (updateData.userId && !Types.ObjectId.isValid(updateData.userId)) {
        return response({
          res,
          code: 400,
          message: "Invalid userId format",
        });
      }

      if (updateData.userId) {
        updateData.userId = new Types.ObjectId(updateData.userId);
      }
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
        if (isNaN(updateData.date.getTime())) {
          return response({
            res,
            code: 400,
            message: "Invalid date format",
          });
        }
      }

      const updatedRecord = await operationalRecordService.updateOperationalRecord(id, updateData);

      if (!updatedRecord) {
        return response({
          res,
          code: 404,
          message: "Operational record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Operational record updated successfully",
        data: updatedRecord,
      });
    } catch (error: any) {
      console.error("Error updating operational record:", error);

      if (error.message?.includes("not found")) {
        return response({
          res,
          code: 404,
          message: error.message,
        });
      } else if (error.message?.includes("already exists")) {
        return response({
          res,
          code: 409,
          message: error.message,
        });
      } else {
        return response({
          res,
          code: 500,
          message: "Failed to update operational record",
        });
      }
    }
  },

  deleteOperationalRecord: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid record ID format",
        });
      }

      const deletedRecord = await operationalRecordService.deleteOperationalRecord(id);

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
