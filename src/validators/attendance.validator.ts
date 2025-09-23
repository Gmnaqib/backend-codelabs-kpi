// import { getEndOfDayWIB, getStartOfDayWIB, getTimeTodayWIB, getNowWIBAsDateTime } from '../helper/dateHelper';
import attendanceRepository from "../repository/attendance.repository";
import userRepository from "../repository/user.repository";
import settingRepository from "../repository/setting.respository";
import dateHelper from "../helper/dateHelper";

export const attendanceValidate = {
  checkIn: async (userId: string, device: { device_id: string }): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeIn = dateHelper.getTimeTodayWIB(6);
    const timeLate = dateHelper.getTimeTodayWIB(22);
    const { device_id } = device;

    if (now < timeIn) {
      throw new Error("You can check in after 6:00 AM");
    }

    if (now > timeLate) {
      throw new Error("It’s too late to check in");
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
      throw new Error("You have already checked in");
    }
  },

  checkOut: async (userId: string, device: { device_id: string }): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    let timeOut = dateHelper.getTimeTodayWIB(17);
    const { device_id } = device;

    const isRamadhan = await settingRepository.findByCode("RAMADHAN");
    const isSemesterHoliday = await settingRepository.findByCode("SEMESTER_HOLIDAY");

    if (isRamadhan?.value === true || isSemesterHoliday?.value === true) {
      timeOut = dateHelper.getTimeTodayWIB(16);
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

    if (!userAttendance) {
      throw new Error("You not checkin today");
    }

    if (now < timeOut) {
      throw new Error("Too early to check out");
    }
  },

  leaveOrSick: async (userId: string, type: string, reason: string, attachmentUrl: string, startDate: Date, endDate: Date) => {
    const now = dateHelper.getNowWIBAsDateTime();
    let timeLimit = dateHelper.getTimeTodayWIB(12);

    if (!type || !reason || !attachmentUrl || !startDate || !endDate) {
      throw new Error("All fields are required");
    }

    if (now > timeLimit) {
      throw new Error("It’s too late to submit a leave or sick request today");
    }
    const userAttendance = await attendanceRepository.findAttendance({
      userId,
      startDate: {
        $gte: now.toISODate(),
      },
    });

    if (userAttendance) {
      throw new Error("A leave request already exists for this date");
    }
    return userAttendance;
  },
};

export default attendanceValidate;

// code;
// ("IS_RAMADHAN");
// name;
// ("Ramadhan");

// code;
// ("SEMESTER_HOLIDAY");
// name;
// ("Semester Holiday");
