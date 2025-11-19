import { Request, Response } from "express";
import response from "../helper/response";
import { AuthRequest } from "../middlewares/auth.middlewares";
import scheduleService from "../services/schedule.service";
import { ScheduleType } from "../models/schedule/schedule.interface";

const scheduleController = {
  createSchedule: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { type, date, days, description } = req.body;

      const schedule = await scheduleService.createSchedule(type, date, days, description);

      return response({
        res,
        code: 201,
        message: "Schedule created successfully",
        data: schedule,
      });
    } catch (error: any) {
      return response({ res, code: 400, message: error.message });
    }
  },

  getAllSchedules: async (req: Request, res: Response): Promise<any> => {
    try {
      const { type, date, day } = req.query;
      let schedules;
      let message = "Schedules retrieved successfully";

      // Validate day if provided
      if (day) {
        const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const dayLower = (day as string).toLowerCase();

        if (!validDays.includes(dayLower)) {
          return response({ res, code: 400, message: "Invalid day. Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday" });
        }
      }

      // Validate type if provided
      if (type && !Object.values(ScheduleType).includes(type as ScheduleType)) {
        return response({ res, code: 400, message: "Invalid schedule type" });
      }

      // Handle combined filters
      if (type && day) {
        schedules = await scheduleService.getSchedulesByTypeAndDay(type as ScheduleType, (day as string).toLowerCase());
        message = `${type} schedules for ${(day as string).toLowerCase()} retrieved successfully`;
      } else if (type && date) {
        const targetDate = new Date(date as string);
        if (isNaN(targetDate.getTime())) {
          return response({ res, code: 400, message: "Invalid date format" });
        }
        schedules = await scheduleService.getSchedulesByTypeAndDate(type as ScheduleType, targetDate);
        message = `${type} schedules for date retrieved successfully`;
      } else if (type) {
        if (type === ScheduleType.thematic) {
          schedules = await scheduleService.getActiveThematicSchedules();
          message = "Active thematic schedules retrieved successfully";
        } else {
          schedules = await scheduleService.getSchedulesByType(type as ScheduleType);
          message = `${type} schedules retrieved successfully`;
        }
      } else if (date) {
        const targetDate = new Date(date as string);
        if (isNaN(targetDate.getTime())) {
          return response({ res, code: 400, message: "Invalid date format" });
        }
        schedules = await scheduleService.getSchedulesByDate(targetDate);
        message = "Schedules for date retrieved successfully";
      } else if (day) {
        schedules = await scheduleService.getSchedulesByDay((day as string).toLowerCase());
        message = `Schedules for ${(day as string).toLowerCase()} retrieved successfully`;
      } else {
        schedules = await scheduleService.getAllSchedules();
        message = "All schedules retrieved successfully";
      }

      return response({
        res,
        code: 200,
        message,
        data: schedules,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getScheduleById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const schedule = await scheduleService.getScheduleById(id);
      if (!schedule) {
        return response({ res, code: 404, message: "Schedule not found" });
      }

      return response({
        res,
        code: 200,
        message: "Schedule retrieved successfully",
        data: schedule,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  updateSchedule: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { type, date, days, description } = req.body;

      const updatedSchedule = await scheduleService.updateSchedule(id, {
        type,
        date,
        days,
        description,
      });

      if (!updatedSchedule) {
        return response({ res, code: 404, message: "Schedule not found" });
      }

      return response({
        res,
        code: 200,
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error: any) {
      return response({ res, code: 400, message: error.message });
    }
  },

  partialUpdateSchedule: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      const filteredUpdateFields: any = {};

      if (updateFields.type !== undefined) filteredUpdateFields.type = updateFields.type;
      if (updateFields.date !== undefined) filteredUpdateFields.date = updateFields.date;
      if (updateFields.days !== undefined) filteredUpdateFields.days = updateFields.days;
      if (updateFields.description !== undefined) filteredUpdateFields.description = updateFields.description;

      if (Object.keys(filteredUpdateFields).length === 0) {
        return response({ res, code: 400, message: "No valid fields to update" });
      }

      const updatedSchedule = await scheduleService.partialUpdateSchedule(id, filteredUpdateFields);

      if (!updatedSchedule) {
        return response({ res, code: 404, message: "Schedule not found" });
      }

      return response({
        res,
        code: 200,
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error: any) {
      return response({ res, code: 400, message: error.message });
    }
  },

  deleteSchedule: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const deletedSchedule = await scheduleService.deleteSchedule(id);

      if (!deletedSchedule) {
        return response({ res, code: 404, message: "Schedule not found" });
      }

      return response({
        res,
        code: 200,
        message: "Schedule deleted successfully",
        data: deletedSchedule,
      });
    } catch (error: any) {
      return response({ res, code: 400, message: error.message });
    }
  },
};

export default scheduleController;
