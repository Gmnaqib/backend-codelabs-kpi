import { Request, Response } from "express";
import response from "../helper/response";
import { AuthRequest } from "../middlewares/auth.middlewares";
import attendanceService from "../services/attendance.service";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import { Types } from "mongoose";

const attendanceController = {
  checkin: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const deviceData = req.body;
      const reason = req.body.reason;

      await attendanceService.checkIn(userId, deviceData, reason);
      return response({ res, code: 201, message: "Checkin success" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  checkOut: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const deviceData = req.body;

      await attendanceService.checkOut(userId, deviceData);
      return response({ res, code: 200, message: "Checkout success" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  submitLeaveOrSick: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { type, reason, attachment_url, start_date, end_date } = req.body;
      const newLeaveRequest = await attendanceService.submitleaveRequest(userId, type, reason, attachment_url, start_date, end_date);

      return response({ res, code: 201, message: "Leave request created successfully", data: newLeaveRequest });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendance: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month, day } = req.query;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const dayNum = day ? Number(day) : undefined;
      const attendances = await attendanceService.getAttendance(yearNum, monthNum, dayNum);
      return response({ res, code: 200, message: "Attendance retrieved successfully", data: attendances });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month, day } = req.query;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const dayNum = day ? Number(day) : undefined;
      const summary = await attendanceService.getAttendanceSummary(yearNum, monthNum, dayNum);
      return response({ res, code: 200, message: "Attendance summary retrieved successfully", data: summary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceSummaryDetail: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const userId = req.params.id;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const detailSummary = await attendanceService.getAttendanceSummaryDetail(new Types.ObjectId(userId), yearNum, monthNum);
      return response({ res, code: 200, message: "Attendance detail summary retrieved successfully", data: detailSummary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getLeaveRequests: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month, day } = req.query;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const dayNum = day ? Number(day) : undefined;

      const requests = await attendanceService.getLeaveRequests(yearNum, monthNum, dayNum);
      return response({
        res,
        code: 200,
        message: "All sick leave requests retrieved successfully",
        data: requests,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getLeaveRequestById: async (req: Request, res: Response): Promise<any> => {
    try {
      const requestId = req.params.id;
      const leaveRequest = await attendanceService.getLeaveRequestById(new Types.ObjectId(requestId));
      return response({
        res,
        code: 200,
        message: "Get Leave request by ID success",
        data: leaveRequest,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  reviewLeaveRequests: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const reviewerUserId = req.user?.id;
      const { approvalStatus } = req.body;
      const attendanceId = req.params.requestId;
      await attendanceService.reviewLeaveRequest(reviewerUserId, new Types.ObjectId(attendanceId), approvalStatus);
      return response({ res, code: 200, message: "Leave request reviewed successfully" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default attendanceController;
