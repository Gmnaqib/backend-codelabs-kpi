import { ScheduleType, IScheduleDays } from "../models/schedule/schedule.interface";
import userRepository from "../repository/user.repository";
import scheduleRepository from "../repository/schedule.repository";
import { Types } from "mongoose";

const scheduleValidator = {
  createSchedule: async (type: ScheduleType, date?: Date, days?: IScheduleDays, description?: string): Promise<void> => {
    if (!Object.values(ScheduleType).includes(type)) {
      throw new Error("Invalid schedule type. Must be 'picket' or 'thematic'");
    }

    if (type === ScheduleType.picket) {
      if (date) {
        throw new Error("Picket schedules cannot have a date");
      }
      if (!days) {
        throw new Error("Picket schedules must have days assignment");
      }

      const allowedDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      for (const day in days) {
        if (!allowedDays.includes(day)) {
          throw new Error("Picket schedules can only use Monday through Saturday");
        }

        if (days[day as keyof IScheduleDays]) {
          await scheduleValidator.validateUserIds(days[day as keyof IScheduleDays]!);
        }
      }
    }

    if (type === ScheduleType.thematic) {
      if (!date) {
        throw new Error("Thematic schedules must have a date");
      }
      if (!description) {
        throw new Error("Thematic schedules must have a description");
      }
      if (!days) {
        throw new Error("Thematic schedules must have days assignment");
      }

      for (const day in days) {
        if (days[day as keyof IScheduleDays]) {
          await scheduleValidator.validateUserIds(days[day as keyof IScheduleDays]!);
        }
      }

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (date < currentDate) {
        throw new Error("Thematic schedule date cannot be in the past");
      }
    }
  },

  updateSchedule: async (scheduleId: string, updateData: { type?: ScheduleType; date?: Date; days?: IScheduleDays; description?: string }): Promise<void> => {
    const existingSchedule = await scheduleRepository.findScheduleById(scheduleId);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    const newType = updateData.type || existingSchedule.type;
    const newDate = updateData.date !== undefined ? updateData.date : existingSchedule.date;
    const newDays = updateData.days || existingSchedule.days;
    const newDescription = updateData.description !== undefined ? updateData.description : existingSchedule.description;

    await scheduleValidator.createSchedule(newType, newDate, newDays, newDescription);
  },

  validateUserIds: async (userIds: string[]): Promise<void> => {
    if (!Array.isArray(userIds)) {
      throw new Error("User IDs must be provided as an array");
    }

    for (const userId of userIds) {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID format: ${userId}`);
      }

      const user = await userRepository.findUserById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }
    }
  },

  deleteSchedule: async (scheduleId: string): Promise<void> => {
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new Error("Invalid schedule ID format");
    }

    const existingSchedule = await scheduleRepository.findScheduleById(scheduleId);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }
  },

  validateDay: (day: string): void => {
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!validDays.includes(day.toLowerCase())) {
      throw new Error("Invalid day. Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
    }
  },
};

export default scheduleValidator;
