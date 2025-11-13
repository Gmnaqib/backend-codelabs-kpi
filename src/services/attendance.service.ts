import attendanceRepository from "../repository/attendance.repository";
import leaveRequestRepository from "../repository/leave.request.repository";
import userRepository from "../repository/user.repository";
import attendanceValidate from "../validators/attendance.validator";
import leaveRequestValidate from "../validators/leaveRequest.validator";
import { Types } from "mongoose";
import IAttendance, { attendanceStatus } from "../models/attendance/attendance.Interface";
import IleaveRequest, { attendanceType, approvalStatus } from "../models/attendance/leave.request.interface";

const mapLeaveTypeToAttendanceStatus = (type: attendanceType): attendanceStatus => {
  switch (type) {
    case "sick":
      return attendanceStatus.SICK;
    case "leave":
      return attendanceStatus.LEAVE;
  }
};

const attendanceService = {
  checkIn: async (userId: string, deviceData: { device_id: string }, reason?: string): Promise<IAttendance> => {
    const validationResult = await attendanceValidate.checkIn(userId, deviceData, reason);
    const userObjectId = new Types.ObjectId(userId);

    if (validationResult.isLateCheckIn) {
      return await attendanceRepository.createAttendance({
        userId: userObjectId,
        date: new Date(),
        status: attendanceStatus.PRESENT,
        checkIn: new Date(),
        checkOut: null,
        reason: reason,
      });
    }

    return await attendanceRepository.createAttendance({
      userId: userObjectId,
      date: new Date(),
      status: attendanceStatus.PRESENT,
      checkIn: new Date(),
      checkOut: null,
    });
  },

  checkOut: async (userId: string, deviceData: { device_id: string }): Promise<IAttendance> => {
    await attendanceValidate.checkOut(userId, deviceData);
    const userAttendance = await attendanceRepository.findAttendance({ userId });

    if (!userAttendance) {
      throw new Error("Attendance not found");
    }

    userAttendance.checkOut = new Date();
    await userAttendance.save();
    return userAttendance;
  },

  submitLeaveOrSick: async (userId: string, type: attendanceType, reason: string, attachmentUrl: string, startDate: Date, endDate: Date): Promise<IleaveRequest> => {
    await attendanceValidate.leaveOrSick(userId, type, reason, attachmentUrl, startDate, endDate);
    const userObjectId = new Types.ObjectId(userId);
    return await leaveRequestRepository.createLeaveRequest({
      userId: userObjectId,
      type,
      reason,
      attachmentUrl,
      startDate,
      endDate,
    });
  },

  reviewLeaveRequest: async (reviewerUserId: string, requestId: string, approvalStatus: approvalStatus): Promise<void> => {
    await leaveRequestValidate.reviewLeaveRequest(reviewerUserId, requestId, approvalStatus);
    const objectId = new Types.ObjectId(requestId);
    const reviewerObjectId = new Types.ObjectId(reviewerUserId);
    const searchLeaveRequest = await leaveRequestRepository.findLeaveRequestById(requestId);

    const startDate = searchLeaveRequest!.startDate;
    const endDate = searchLeaveRequest!.endDate;

    searchLeaveRequest!.approvedBy = reviewerObjectId;
    searchLeaveRequest!.approvalStatus = approvalStatus;
    await searchLeaveRequest!.save();

    if (approvalStatus === "approved") {
      let currentDate = new Date(startDate!);
      while (currentDate <= endDate!) {
        await attendanceRepository.createAttendance({
          userId: searchLeaveRequest!.userId,
          date: new Date(currentDate),
          status: mapLeaveTypeToAttendanceStatus(searchLeaveRequest!.type),
          leaveRequestId: objectId,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  },

  getAttendanceMonthly: async (month?: number, year?: number): Promise<IAttendance[]> => {
    if (!month || !year) {
      return await attendanceRepository.findAllAttendances();
    }
    return await attendanceRepository.findMonthlyAttendances(month, year);
  },

  getAttendanceSummary: async (year?: number, month?: number): Promise<any> => {
    let attendanceRecords: IAttendance[];
    if (!month || !year) {
      attendanceRecords = await attendanceRepository.findAllAttendances();
    } else {
      attendanceRecords = await attendanceRepository.findMonthlyAttendances(month, year);
    }

    const userGroups = new Map<string, IAttendance[]>();

    attendanceRecords.forEach((record) => {
      const userIdStr = record.userId.toString();
      if (!userGroups.has(userIdStr)) {
        userGroups.set(userIdStr, []);
      }
      userGroups.get(userIdStr)!.push(record);
    });

    const uniqueUserIds = Array.from(userGroups.keys());

    const userMap = new Map();
    for (const userId of uniqueUserIds) {
      try {
        const user = await userRepository.findUserById(userId);
        if (user) {
          userMap.set(userId, user.name);
        }
      } catch (error) {
        userMap.set(userId, "Unknown User");
      }
    }

    const summaryResults = Array.from(userGroups.entries()).map(([userId, records]) => {
      // Count each status using array filter + .length
      const presentCount = records.filter((r) => r.status === "present" && !r.reason).length;
      const lateCount = records.filter((r) => r.status === "present" && r.reason).length;
      const sickCount = records.filter((r) => r.status === "sick").length;
      const leaveCount = records.filter((r) => r.status === "leave").length;
      const absentCount = records.filter((r) => r.status === "absent").length;

      // Build counts object with all statuses
      const counts: any = {};
      if (presentCount > 0) counts.present = presentCount;
      if (lateCount > 0) counts.late = lateCount;
      if (sickCount > 0) counts.sick = sickCount;
      if (leaveCount > 0) counts.leave = leaveCount;
      if (absentCount > 0) counts.absent = absentCount;

      return {
        userId,
        userName: userMap.get(userId) || "Unknown User",
        counts,
      };
    });

    return summaryResults;
  },

  getAttendanceByStatus: async (userId: string, status?: string, month?: number, year?: number): Promise<any> => {
    if (!month || !year) {
      const filter = { userId: new Types.ObjectId(userId) };
      const attendanceRecords = await attendanceRepository.findAttendancesByFilter(filter);
      const user = await userRepository.findUserById(userId);
      const userName = user?.name || "Unknown User";

      const statusGroups: any = {};

      const presentRecords = attendanceRecords.filter((r) => r.status === "present" && !r.reason);
      const lateRecords = attendanceRecords.filter((r) => r.status === "present" && r.reason);
      const sickRecords = attendanceRecords.filter((r) => r.status === "sick");
      const leaveRecords = attendanceRecords.filter((r) => r.status === "leave");
      const absentRecords = attendanceRecords.filter((r) => r.status === "absent");

      if (presentRecords.length > 0) {
        statusGroups.present = {
          count: presentRecords.length,
          dates: presentRecords.map((r) => r.date),
        };
      }

      if (lateRecords.length > 0) {
        statusGroups.late = {
          count: lateRecords.length,
          dates: lateRecords.map((r) => r.date),
        };
      }

      if (sickRecords.length > 0) {
        statusGroups.sick = {
          count: sickRecords.length,
          dates: sickRecords.map((r) => r.date),
        };
      }

      if (leaveRecords.length > 0) {
        statusGroups.leave = {
          count: leaveRecords.length,
          dates: leaveRecords.map((r) => r.date),
        };
      }

      if (absentRecords.length > 0) {
        statusGroups.absent = {
          count: absentRecords.length,
          dates: absentRecords.map((r) => r.date),
        };
      }

      const result = Object.entries(statusGroups).map(([status, data]: [string, any]) => ({
        status,
        count: data.count,
        dates: data.dates,
      }));

      return {
        userId,
        userName,
        statusSummary: result,
      };
    }

    const attendanceRecords = await attendanceRepository.findAttendanceDetailsByStatus(userId, status!, month, year);

    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    return {
      userId,
      userName,
      status,
      month,
      year,
      records: attendanceRecords,
    };
  },

  getAllLeaveRequests: async (filters?: any): Promise<any[]> => {
    let leaveRequests;

    if (!filters || Object.keys(filters).length === 0) {
      leaveRequests = await leaveRequestRepository.findAllLeaveRequests();
    } else {
      const formattedFilter: any = { ...filters };

      if (filters.userId) {
        formattedFilter.userId = new Types.ObjectId(filters.userId);
      }

      // Handle date parsing and validation
      let dateFilter: { year: number; month: number } | undefined;
      if (filters.date) {
        const parsedDate = new Date(filters.date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth() + 1;
        dateFilter = { year, month };
      }

      // Remove date from formattedFilter and pass it separately
      const { date, ...queryFilter } = formattedFilter;

      leaveRequests = await leaveRequestRepository.findLeaveRequestsByFilter(queryFilter, dateFilter);
    }

    const uniqueUserIds = [...new Set(leaveRequests.map((request) => request.userId.toString()))];

    const userMap = new Map();
    for (const userId of uniqueUserIds) {
      try {
        const user = await userRepository.findUserById(userId);
        if (user) {
          userMap.set(userId, user.name);
        }
      } catch (error) {
        userMap.set(userId, "Unknown User");
      }
    }

    return leaveRequests.map((request) => ({
      ...request.toObject(),
      userName: userMap.get(request.userId.toString()) || "Unknown User",
    }));
  },

  getTodayLeaveRequests: async (): Promise<any[]> => {
    const dateHelper = (await import("../helper/dateHelper")).default;
    const todayStart = dateHelper.getStartOfDayWIB();
    const todayEnd = dateHelper.getEndOfDayWIB();

    const leaveRequests = await leaveRequestRepository.findTodayLeaveRequests(todayStart, todayEnd);

    const uniqueUserIds = [...new Set(leaveRequests.map((request) => request.userId.toString()))];

    const userMap = new Map();
    for (const userId of uniqueUserIds) {
      try {
        const user = await userRepository.findUserById(userId);
        if (user) {
          userMap.set(userId, user.name);
        }
      } catch (error) {
        userMap.set(userId, "Unknown User");
      }
    }

    return leaveRequests.map((request) => ({
      ...request.toObject(),
      userName: userMap.get(request.userId.toString()) || "Unknown User",
    }));
  },

  getLeaveRequestsByStatus: async (status: approvalStatus): Promise<any[]> => {
    const leaveRequests = await leaveRequestRepository.findLeaveRequestsByStatus(status);

    const uniqueUserIds = [...new Set(leaveRequests.map((request) => request.userId.toString()))];

    const userMap = new Map();
    for (const userId of uniqueUserIds) {
      try {
        const user = await userRepository.findUserById(userId);
        if (user) {
          userMap.set(userId, user.name);
        }
      } catch (error) {
        userMap.set(userId, "Unknown User");
      }
    }

    return leaveRequests.map((request) => ({
      ...request.toObject(),
      userName: userMap.get(request.userId.toString()) || "Unknown User",
    }));
  },

  getLeaveRequestsByUserId: async (userId: string): Promise<any[]> => {
    const leaveRequests = await leaveRequestRepository.findLeaveRequestsByUserId(userId);

    let userName = "Unknown User";
    try {
      const user = await userRepository.findUserById(userId);
      if (user) {
        userName = user.name;
      }
    } catch (error) {
      userName = "Unknown User";
    }

    return leaveRequests.map((request) => ({
      ...request.toObject(),
      userName,
    }));
  },
};

export default attendanceService;
