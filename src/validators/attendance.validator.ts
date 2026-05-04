import attendanceRepository from "../repository/attendance.repository";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import userRepository from "../repository/user.repository";
import settingRepository from "../repository/setting.respository";
import dateHelper from "../helper/dateHelper";
import { Types } from "mongoose";

export const attendanceValidate = {
  checkIn: async (userId: Types.ObjectId, device: { device_id: string }, reason?: string): Promise<{ isLateCheckIn: boolean }> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeIn = dateHelper.getTimeTodayWIB(6);
    const timeLimit = dateHelper.getTimeTodayWIB(9);
    const timeLateLimit = dateHelper.getTimeTodayWIB(10);
    const { device_id } = device;

    if (now < timeIn) {
      throw new Error("You can check in after 6:00 AM");
    }

    if (now > timeLateLimit) {
      throw new Error("It's too late to check in");
    }

    const userDevice = await userRepository.findUserDevice(userId);

    if (!userDevice?.device_id) {
      throw new Error("Device not found");
    }

    if (userDevice.device_id !== device_id) {
      throw new Error("Device not registered");
    }

    const userAttendance = await attendanceRepository.findOne({
      userId,
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (userAttendance) {
      throw new Error("You have already checked in");
    }

    // Check if it's a late check-in and validate reason requirement
    const isLateCheckIn = now > timeLimit && now < timeLateLimit;
    if (isLateCheckIn && !reason) {
      throw new Error("Reason is required for late check-in");
    }

    return { isLateCheckIn };
  },

  checkOut: async (userId: Types.ObjectId, device: { device_id: string }): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    let timeOut = dateHelper.getTimeTodayWIB(17);
    const { device_id } = device;

    const isRamadhan = await settingRepository.findSettingByCode("RAMADHAN");

    if (isRamadhan?.value === true) {
      timeOut = dateHelper.getTimeTodayWIB(16);
    }

    const userDevice = await userRepository.findUserDevice(userId);

    if (!userDevice?.device_id) {
      throw new Error("Device not found");
    }

    if (userDevice.device_id !== device_id) {
      throw new Error("Device not registered");
    }

    const userAttendance = await attendanceRepository.findOne({
      userId,
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!userAttendance) {
      throw new Error("You not checkin today");
    }

    if (now < timeOut) {
      throw new Error("Too early to check out");
    }
  },

  leaveOrSick: async (userId: Types.ObjectId, status: attendanceStatus, reason: string, attachmentUrl: string, startDate: Date, endDate: Date): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    let timeLimit = dateHelper.getTimeTodayWIB(10);
    const userObjectId = new Types.ObjectId(userId);

    if (!status || !reason || !attachmentUrl || !startDate || !endDate) {
      throw new Error("All fields are required");
    }

    if (now > timeLimit) {
      throw new Error("It's too late to submit a leave or sick request today");
    }

    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const existingAttendance = await attendanceRepository.findOne({
        userId: userObjectId,
        createdAt: d,
      });

      if (existingAttendance) {
        throw new Error("Anda sudah absen pada tanggal " + d.toISOString().split("T")[0]);
      }
    }
  },

  reviewLeaveRequest: async (requestId: string): Promise<void> => {
    if (!requestId) {
      throw new Error("Request ID is required");
    }

    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error("Invalid request ID format");
    }
  },
};

export default attendanceValidate;
