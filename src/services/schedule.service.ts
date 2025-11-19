import scheduleRepository from "../repository/schedule.repository";
import userRepository from "../repository/user.repository";
import scheduleValidator from "../validators/schedule.validator";
import ISchedule, { ScheduleType, IScheduleDays } from "../models/schedule/schedule.interface";
import { Types } from "mongoose";

interface IScheduleWithUserNames extends Omit<ISchedule, "days"> {
  _id?: string;
  days?: {
    monday?: { userId: string; userName: string }[];
    tuesday?: { userId: string; userName: string }[];
    wednesday?: { userId: string; userName: string }[];
    thursday?: { userId: string; userName: string }[];
    friday?: { userId: string; userName: string }[];
    saturday?: { userId: string; userName: string }[];
    sunday?: { userId: string; userName: string }[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const scheduleService = {
  createSchedule: async (type: ScheduleType, date?: Date, days?: IScheduleDays, description?: string): Promise<IScheduleWithUserNames> => {
    await scheduleValidator.createSchedule(type, date, days, description);

    const scheduleData: Partial<ISchedule> = { type };
    if (date) scheduleData.date = date;
    if (days) scheduleData.days = days;
    if (description) scheduleData.description = description;

    const createdSchedule: ISchedule = await scheduleRepository.createSchedule(scheduleData);
    const populated = await scheduleService.populateUserNames([createdSchedule]);
    return populated[0];
  },

  getAllSchedules: async (): Promise<IScheduleWithUserNames[]> => {
    const schedules = await scheduleRepository.findAllSchedules();
    return await scheduleService.populateUserNames(schedules);
  },

  getScheduleById: async (id: string): Promise<IScheduleWithUserNames | null> => {
    const schedule = await scheduleRepository.findScheduleById(id);
    if (!schedule) return null;

    const populated = await scheduleService.populateUserNames([schedule]);
    return populated[0] || null;
  },

  getSchedulesByType: async (type: ScheduleType): Promise<IScheduleWithUserNames[]> => {
    const schedules = await scheduleRepository.findSchedulesByType(type);
    return await scheduleService.populateUserNames(schedules);
  },

  getSchedulesByDate: async (date: Date): Promise<IScheduleWithUserNames[]> => {
    const schedules = await scheduleRepository.findSchedulesByDate(date);
    return await scheduleService.populateUserNames(schedules);
  },

  getActiveThematicSchedules: async (): Promise<IScheduleWithUserNames[]> => {
    const currentDate = new Date();
    const schedules = await scheduleRepository.findActiveThematicSchedules(currentDate);
    return await scheduleService.populateUserNames(schedules);
  },

  updateSchedule: async (id: string, updateData: { type?: ScheduleType; date?: Date; days?: IScheduleDays; description?: string }): Promise<IScheduleWithUserNames | null> => {
    await scheduleValidator.updateSchedule(id, updateData);

    const updatedSchedule = await scheduleRepository.updateScheduleById(id, updateData);
    if (!updatedSchedule) return null;

    const populated = await scheduleService.populateUserNames([updatedSchedule]);
    return populated[0];
  },

  partialUpdateSchedule: async (id: string, updateData: { type?: ScheduleType; date?: Date; days?: IScheduleDays; description?: string }): Promise<IScheduleWithUserNames | null> => {
    const existingSchedule = await scheduleRepository.findScheduleById(id);
    if (!existingSchedule) return null;

    let finalUpdateData = { ...updateData };

    if (updateData.days) {
      finalUpdateData.days = updateData.days;
    }

    const mergedData = {
      type: finalUpdateData.type || existingSchedule.type,
      date: finalUpdateData.date !== undefined ? finalUpdateData.date : existingSchedule.date,
      days: finalUpdateData.days || existingSchedule.days,
      description: finalUpdateData.description !== undefined ? finalUpdateData.description : existingSchedule.description,
    };

    await scheduleValidator.updateSchedule(id, mergedData);
    const updatedSchedule = await scheduleRepository.updateScheduleById(id, finalUpdateData);
    if (!updatedSchedule) return null;

    const populated = await scheduleService.populateUserNames([updatedSchedule]);
    return populated[0];
  },

  deleteSchedule: async (id: string): Promise<IScheduleWithUserNames | null> => {
    await scheduleValidator.deleteSchedule(id);

    const deletedSchedule = await scheduleRepository.deleteScheduleById(id);
    if (!deletedSchedule) return null;

    const populated = await scheduleService.populateUserNames([deletedSchedule]);
    return populated[0];
  },

  populateUserNames: async (schedules: ISchedule[]): Promise<IScheduleWithUserNames[]> => {
    const allUserIds = new Set<string>();

    schedules.forEach((schedule) => {
      if (schedule.days) {
        Object.values(schedule.days).forEach((dayUsers) => {
          if (dayUsers) {
            dayUsers.forEach((userId: string) => allUserIds.add(userId));
          }
        });
      }
    });

    const userMap = new Map<string, string>();
    if (allUserIds.size > 0) {
      for (const userId of allUserIds) {
        try {
          const user = await userRepository.findUserById(userId);
          userMap.set(userId, user?.name || "Unknown User");
        } catch (error) {
          userMap.set(userId, "Unknown User");
        }
      }
    }

    return schedules.map((schedule) => {
      const transformed: IScheduleWithUserNames = {
        _id: (schedule as any)._id?.toString(),
        type: schedule.type,
        date: schedule.date,
        description: schedule.description,
        createdAt: (schedule as any).createdAt,
        updatedAt: (schedule as any).updatedAt,
      };

      if (schedule.days) {
        transformed.days = {};

        (Object.keys(schedule.days) as Array<keyof IScheduleDays>).forEach((day) => {
          if (schedule.days![day]) {
            transformed.days![day] = schedule.days![day]!.map((userId) => ({
              userId,
              userName: userMap.get(userId) || "Unknown User",
            }));
          }
        });
      }

      return transformed;
    });
  },
};

export default scheduleService;
