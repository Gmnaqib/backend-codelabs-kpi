import attendanceRepository from "../repository/attendance.repository";
import attendanceValidate from "../validators/attendance.validator";
import userRepository from "../repository/user.repository";
import leaveRequestValidate from "../validators/leaveRequest.validator";
import IAttendance, { attendanceStatus, approvalStatus } from "../models/attendance/attendance.Interface";
import { Types } from "mongoose";

const attendanceService = {
  checkIn: async (userId: Types.ObjectId, deviceId: { device_id: string }, reason?: string): Promise<IAttendance> => {
    const validationResult = await attendanceValidate.checkIn(userId, deviceId, reason);
    const userObjectId = new Types.ObjectId(userId);

    if (validationResult.isLateCheckIn) {
      return await attendanceRepository.create({
        userId: userObjectId,
        status: attendanceStatus.PRESENT,
        checkIn: new Date(),
        checkOut: null,
        reason: reason,
      });
    }

    return await attendanceRepository.create({
      userId: userObjectId,
      status: attendanceStatus.PRESENT,
      checkIn: new Date(),
      checkOut: null,
    });
  },

  checkOut: async (userId: Types.ObjectId, deviceId: { device_id: string }): Promise<IAttendance> => {
    const userObjectId = new Types.ObjectId(userId);

    // await attendanceValidate.checkOut(userId, deviceId);

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const userAttendance = await attendanceRepository.findOne({
      userId: userObjectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!userAttendance) {
      throw new Error("Attendance not found");
    }

    if (userAttendance.checkOut != null) {
      throw new Error("You have already checked out");
    }

    userAttendance.checkOut = new Date();
    await userAttendance.save();
    return userAttendance;
  },

  submitleaveRequest: async (
    userId: string,
    type: attendanceStatus,
    reason?: string,
    attachment_url?: string,
    start_date?: Date,
    end_date?: Date,
    approvalStatus?: approvalStatus.PENDING,
  ): Promise<IAttendance> => {
    const userObjectId = new Types.ObjectId(userId);
    return await attendanceRepository.create({
      userId: userObjectId,
      status: type,
      reason: reason,
      attachment_url: attachment_url,
      start_date: start_date,
      end_date: end_date,
      approval_status: approvalStatus,
    });
  },

  getLeaveRequests: async (year?: number, month?: number, day?: number): Promise<IAttendance[]> => {
    if (year !== undefined || month !== undefined || day !== undefined) {
      return await attendanceRepository.findAllWithApprovalStatusAndDate({ year, month, day });
    }
    return await attendanceRepository.findAllWithApprovalStatus();
  },

  getLeaveRequestById: async (attendanceId: Types.ObjectId): Promise<IAttendance> => {
    const attendanceData = await attendanceRepository.findById(attendanceId);
    if (!attendanceData) {
      throw new Error("Attendance ID is required");
    }
    return attendanceData;
  },

  reviewLeaveRequest: async (reviewerUserId: Types.ObjectId, attendanceId: Types.ObjectId, approvalStatus: approvalStatus): Promise<void> => {
    await leaveRequestValidate.reviewLeaveRequest(reviewerUserId, attendanceId, approvalStatus);
    const searchLeaveRequest = await attendanceRepository.findById(attendanceId);
    searchLeaveRequest!.approved_by = reviewerUserId;
    searchLeaveRequest!.approval_status = approvalStatus;
    await searchLeaveRequest!.save();
  },

  getAttendance: async (year?: number, month?: number, day?: number): Promise<IAttendance[]> => {
    if (year !== undefined || month !== undefined || day !== undefined) {
      return await attendanceRepository.findAllWithDate({ year, month, day });
    }
    return await attendanceRepository.findAll({});
  },

  getAttendanceSummary: async (year?: number, month?: number, day?: number): Promise<any> => {
    let attendanceRecords: IAttendance[];

    if (year !== undefined || month !== undefined || day !== undefined) {
      attendanceRecords = await attendanceRepository.findAllWithDate({ year, month, day });
    } else {
      attendanceRecords = await attendanceRepository.findAll({});
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

    const userSummary = Array.from(userGroups.entries()).map(([userId, records]) => {
      const userLate = records.filter((r) => r.status === "present" && r.reason).length;
      const userPresent = records.filter((r) => r.status === "present" && !r.reason).length;
      const userSick = records.filter((r) => r.status === "sick").length;
      const userPermit = records.filter((r) => r.status === "permit").length;
      const rejectedSickPermit = records.filter((r) => (r.status === "sick" || r.status === "permit") && r.approval_status === "rejected").length;

      let startOfPeriod = new Date();
      let endOfPeriod = new Date();

      const today = new Date();
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      if (year !== undefined && month !== undefined) {
        startOfPeriod = new Date(year, month - 1, 1, 0, 0, 0, 0);
        endOfPeriod = todayEnd;
      } else if (year !== undefined) {
        startOfPeriod = new Date(year, 0, 1, 0, 0, 0, 0);
        endOfPeriod = todayEnd;
      } else {
        startOfPeriod = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
        endOfPeriod = todayEnd;
      }

      // Collect dates that have data
      const datesWithData = new Set<string>();
      records.forEach((r) => {
        const dateStr = new Date(r.createdAt ?? new Date()).toISOString().split("T")[0];
        datesWithData.add(dateStr);
      });

      // Count missing dates (Monday-Saturday only)
      let missingDateCount = 0;
      const currentDate = new Date(startOfPeriod);
      while (currentDate <= endOfPeriod) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayOfWeek = currentDate.getDay();

        if (dayOfWeek !== 0 && !datesWithData.has(dateStr)) {
          missingDateCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const userAbsent = rejectedSickPermit + missingDateCount;

      const counts: any = {};
      if (userLate > 0) counts.late = userLate;
      if (userPresent > 0) counts.present = userPresent;
      if (userSick > 0) counts.sick = userSick;
      if (userPermit > 0) counts.permit = userPermit;
      if (userAbsent > 0) counts.absent = userAbsent;

      return { userId, userName: userMap.get(userId), counts };
    });

    return userSummary;
  },

  getAttendanceSummaryDetail: async (userId: Types.ObjectId, year?: number, month?: number, day?: number): Promise<any> => {
    let attendanceRecords: IAttendance[];

    if (year !== undefined || month !== undefined || day !== undefined) {
      attendanceRecords = await attendanceRepository.findAllWithDate({ userId, year, month, day });
    } else {
      attendanceRecords = await attendanceRepository.findAll({ userId });
    }

    let userName = "Unknown User";
    try {
      const user = await userRepository.findUserById(userId.toString());
      if (user) {
        userName = user.name;
      }
    } catch (error) {
      userName = "Unknown User";
    }

    const statusSummary: any[] = [];

    // Late - Present dengan reason
    const lateRecords = attendanceRecords.filter((r) => r.status === "present" && r.reason);
    if (lateRecords.length > 0) {
      statusSummary.push({
        status: "late",
        count: lateRecords.length,
        records: lateRecords.map((r) => ({
          date: r.createdAt,
          reason: r.reason,
          attendanceStatus: r.status,
        })),
      });
    }

    // Present - Present tanpa reason
    const presentRecords = attendanceRecords.filter((r) => r.status === "present" && !r.reason);
    if (presentRecords.length > 0) {
      statusSummary.push({
        status: "present",
        count: presentRecords.length,
        records: presentRecords.map((r) => ({
          date: r.createdAt,
          attendanceStatus: r.status,
        })),
      });
    }

    // Sick
    const sickRecords = attendanceRecords.filter((r) => r.status === "sick");
    if (sickRecords.length > 0) {
      statusSummary.push({
        status: "sick",
        count: sickRecords.length,
        records: sickRecords.map((r) => ({
          date: r.createdAt,
          reason: r.reason || null,
          attendanceStatus: r.status,
          approvalStatus: r.approval_status || null,
        })),
      });
    }

    // Permit/Leave
    const permitRecords = attendanceRecords.filter((r) => r.status === "permit");
    if (permitRecords.length > 0) {
      statusSummary.push({
        status: "permit",
        count: permitRecords.length,
        records: permitRecords.map((r) => ({
          date: r.createdAt,
          reason: r.reason,
          attendanceStatus: r.status,
          approvalStatus: r.approval_status,
        })),
      });
    }

    // Absent - Jika tidak ada data (sick, permit, present) atau jika sick/permit statusnya rejected
    const rejectedSickPermit = attendanceRecords.filter((r) => (r.status === "sick" || r.status === "permit") && r.approval_status === "rejected");

    // Get date range untuk calculate date yang gk ada
    let startOfPeriod = new Date();
    let endOfPeriod = new Date();

    const today = new Date();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    if (year !== undefined && month !== undefined) {
      startOfPeriod = new Date(year, month - 1, 1, 0, 0, 0, 0);
      endOfPeriod = todayEnd;
    } else if (year !== undefined) {
      startOfPeriod = new Date(year, 0, 1, 0, 0, 0, 0);
      endOfPeriod = todayEnd;
    } else {
      startOfPeriod = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
      endOfPeriod = todayEnd;
    }

    // Collect all dates that have data
    const datesWithData = new Set<string>();
    attendanceRecords.forEach((r) => {
      const dateStr = new Date(r.createdAt ?? new Date()).toISOString().split("T")[0];
      datesWithData.add(dateStr);
    });

    // Find missing dates (no data) - exclude Sundays
    const missingDates: Date[] = [];
    const currentDate = new Date(startOfPeriod);
    while (currentDate <= endOfPeriod) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayOfWeek = currentDate.getDay();

      // Only count Monday-Saturday (0 = Sunday, skip it)
      if (dayOfWeek !== 0 && !datesWithData.has(dateStr)) {
        missingDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const absentRecords: any[] = [];

    // Add rejected sick/permit as absent
    rejectedSickPermit.forEach((r) => {
      absentRecords.push({
        date: r.createdAt,
        reason: `${r.status} (rejected)`,
        attendanceStatus: r.status,
        approvalStatus: r.approval_status || null,
      });
    });

    // Add missing dates as absent
    missingDates.forEach((date) => {
      absentRecords.push({
        date,
        reason: "No data",
        attendanceStatus: "absent",
        approvalStatus: null,
      });
    });

    if (absentRecords.length > 0) {
      statusSummary.push({
        status: "absent",
        count: absentRecords.length,
        records: absentRecords,
      });
    }

    return {
      userId,
      userName,
      statusSummary,
    };
  },

  getAttendanceDetailSummaryAll: async (year?: number, month?: number): Promise<any> => {
    let attendanceRecords: IAttendance[];

    if (year !== undefined || month !== undefined) {
      attendanceRecords = await attendanceRepository.findAllWithDate({ year, month });
    } else {
      attendanceRecords = await attendanceRepository.findAll({});
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

    const detailSummary = Array.from(userGroups.entries()).map(([userId, records]) => {
      const sickRecords = records.filter((r) => r.status === "sick");
      const permitRecords = records.filter((r) => r.status === "permit");
      const absentRecords = records.filter((r) => r.status === "absent");

      const details: any = {};

      if (sickRecords.length > 0) {
        details.sick = {
          count: sickRecords.length,
          dates: sickRecords.map((r) => r.createdAt),
        };
      }

      if (permitRecords.length > 0) {
        details.permit = {
          count: permitRecords.length,
          dates: permitRecords.map((r) => r.createdAt),
        };
      }

      if (absentRecords.length > 0) {
        details.absent = {
          count: absentRecords.length,
          dates: absentRecords.map((r) => r.createdAt),
        };
      }

      return {
        userId,
        userName: userMap.get(userId),
        details,
      };
    });

    return detailSummary;
  },
};

export default attendanceService;
