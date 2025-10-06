import { Request, Response, NextFunction } from "express";
import response from "../helper/response";
import { ScheduleType } from "../models/schedule/schedule.interface";

const createSchedule = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const { type, date, days, description } = req.body;

    if (!type) {
      return response({ res, code: 400, message: "Type is required" });
    }

    if (!Object.values(ScheduleType).includes(type)) {
      return response({
        res,
        code: 400,
        message: `Type must be one of: ${Object.values(ScheduleType).join(", ")}`,
      });
    }

    if (type === ScheduleType.picket) {
      if (date) {
        return response({ res, code: 400, message: "Date should not be provided for picket schedules" });
      }
      if (!days) {
        return response({ res, code: 400, message: "Days are required for picket schedules" });
      }

      const allowedDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      for (const day in days) {
        if (!allowedDays.includes(day)) {
          return response({
            res,
            code: 400,
            message: "Picket schedules can only use Monday through Saturday",
          });
        }

        if (days[day] && (!Array.isArray(days[day]) || !days[day].every((id: string) => /^[0-9a-fA-F]{24}$/.test(id)))) {
          return response({
            res,
            code: 400,
            message: `Invalid user ID format in ${day}`,
          });
        }
      }
    }

    if (type === ScheduleType.thematic) {
      if (!date) {
        return response({ res, code: 400, message: "Date is required for thematic schedules" });
      }
      if (!description || description.trim().length === 0) {
        return response({ res, code: 400, message: "Description is required for thematic schedules" });
      }

      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return response({ res, code: 400, message: "Date must be a valid date" });
      }

      if (days) {
        for (const day in days) {
          if (days[day] && (!Array.isArray(days[day]) || !days[day].every((id: string) => /^[0-9a-fA-F]{24}$/.test(id)))) {
            return response({
              res,
              code: 400,
              message: `Invalid user ID format in ${day}`,
            });
          }
        }
      }
    }

    next();
  } catch (error) {
    return response({ res, code: 400, message: "Validation error" });
  }
};

const scheduleMiddlewareValidator = {
  createSchedule,
};

export default scheduleMiddlewareValidator;
