// import { getEndOfDayWIB, getStartOfDayWIB, getTimeTodayWIB, getNowWIBAsDateTime } from '../helper/dateHelper';
import attendanceRepository from "../repository/attendance.repository";
import userRepository from "../repository/user.repository";
import dateHelper from "../helper/dateHelper";

export const attendanceValidate = {
  checkIn: async (userId: string, device: { device_id: string }): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeIn = dateHelper.getTimeTodayWIB(6);
    const timeLimit = dateHelper.getTimeTodayWIB(9);

    const { device_id } = device;

    if (now < timeIn) {
      throw new Error("mulai jam 6");
    }

    if (now > timeLimit) {
      throw new Error("Sudah lewat");
    }

    const userDevice = await userRepository.findUserDevice(userId);

    if (!userDevice?.device_id) {
      throw new Error("Device not found");
    }

    if (userDevice.device_id !== device_id) {
      throw new Error("Device not registered");
    }

    const userAttendance = await attendanceRepository.findAttendance({
      userId,
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (userAttendance) {
      throw new Error("you checkin already");
    }
  },

  checkOut: async (userId: string, device: { device_id: string }): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeOut = dateHelper.getTimeTodayWIB(7);
    const { device_id } = device;

    const userDevice = await userRepository.findUserDevice(userId);

    if (!userDevice?.device_id) {
      throw new Error("Device not found");
    }

    if (userDevice.device_id !== device_id) {
      throw new Error("Device not registered");
    }

    const userAttendance = await attendanceRepository.findAttendance({
      userId,
      checkIn: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!userAttendance) {
      throw new Error("you not checkin today");
    }

    if (now < timeOut) {
      throw new Error("checkout minimal jam 17:00");
    }
  },

  leaveOrSick: async (userId: string, type: string, reason: string, attachmentUrl: string, startDate: Date, endDate: Date) => {
    const now = dateHelper.getNowWIBAsDateTime();

    if (!type || !reason || !attachmentUrl || !startDate || !endDate) {
      throw new Error("semua field harus terisi");
    }

    const userAttendance = await attendanceRepository.findAttendance({
      userId,
      startDate: {
        $gte: now.toISODate(),
      },
    });

    if (userAttendance) {
      throw new Error("udah ada izin di tanggal itu");
    }
    return userAttendance;
  },
};

export default attendanceValidate;
