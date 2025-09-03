// import { getEndOfDayWIB, getStartOfDayWIB, getTimeTodayWIB, getNowWIBAsDateTime } from '../helper/dateHelper';
import attendanceRepository from "../repository/attendance.repository";
import dateHelper from "../helper/dateHelper";

export const attendanceValidate = {
  checkIn: async (userId: string): Promise<void> => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeIn = dateHelper.getTimeTodayWIB(6);
    const timeLimit = dateHelper.getTimeTodayWIB(9);

    if (now < timeIn) {
      throw new Error("mulai jam 6");
    }

    if (now > timeLimit) {
      throw new Error("Sudah lewat");
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

  checkOut: async (userId: string) => {
    const now = dateHelper.getNowWIBAsDateTime();
    const startOfDay = dateHelper.getStartOfDayWIB();
    const endOfDay = dateHelper.getEndOfDayWIB();
    const timeOut = dateHelper.getTimeTodayWIB(17);

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

    return userAttendance;
  },

  leaveOrSick: async (userId: string, status: string, reason: string, proveImage: string) => {
    const now = dateHelper.getNowWIBAsDateTime();

    if (!status || !reason || !proveImage) {
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
