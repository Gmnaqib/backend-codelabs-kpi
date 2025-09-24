import attendanceRepository from "../repository/attendance.repository";
import leaveRequestRepository from "../repository/leave.request.repository";
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
    // Call validator
    const validationResult = await attendanceValidate.checkIn(userId, deviceData, reason);

    // Call repository
    const userObjectId = new Types.ObjectId(userId);

    if (validationResult.isLateCheckIn) {
      return await attendanceRepository.createAttendance({
        userId: userObjectId,
        date: new Date(),
        checkIn: new Date(),
        checkOut: null,
        reason: reason,
      });
    }

    return await attendanceRepository.createAttendance({
      userId: userObjectId,
      date: new Date(),
      checkIn: new Date(),
      checkOut: null,
    });
  },

  checkOut: async (userId: string, deviceData: { device_id: string }): Promise<IAttendance> => {
    // Call validator
    await attendanceValidate.checkOut(userId, deviceData);

    // Call repository
    const userAttendance = await attendanceRepository.findAttendance({ userId });

    if (!userAttendance) {
      throw new Error("Attendance not found");
    }

    userAttendance.checkOut = new Date();
    await userAttendance.save();
    return userAttendance;
  },

  submitLeaveOrSick: async (userId: string, type: attendanceType, reason: string, attachmentUrl: string, startDate: Date, endDate: Date): Promise<IleaveRequest> => {
    // Call validator
    await attendanceValidate.leaveOrSick(userId, type, reason, attachmentUrl, startDate, endDate);

    // Call repository
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
    // Call validator
    await leaveRequestValidate.reviewLeaveRequest(reviewerUserId, requestId, approvalStatus);

    // Call repository
    const objectId = new Types.ObjectId(requestId);
    const reviewerObjectId = new Types.ObjectId(reviewerUserId);
    const searchLeaveRequest = await leaveRequestRepository.findLeaveRequestById(requestId);

    const startDate = searchLeaveRequest!.startDate;
    const endDate = searchLeaveRequest!.endDate;

    // Update the leave request
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
    if (!month || !year) {
      return await attendanceRepository.getAttendanceSummary();
    }
    return await attendanceRepository.getAttendanceMonthlySummary(year, month);
  },

  getAttendanceByStatus: async (userId: string, status?: string, month?: number, year?: number): Promise<any> => {
    if (!month || !year) {
      return await attendanceRepository.getAttendanceSummaryWithDates(userId);
    }
    return await attendanceRepository.findAttendanceDetailsByStatus(userId, status!, month, year);
  },
};

export default attendanceService;
