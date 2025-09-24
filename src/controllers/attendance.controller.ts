import { Request, Response } from "express";
import response from "../helper/response";
import { AuthRequest } from "../middlewares/auth.middlewares";
import attendanceService from "../services/attendance.service";

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
      const { type, reason, attachmentUrl, startDate, endDate } = req.body;

      const newLeaveRequest = await attendanceService.submitLeaveOrSick(userId, type, reason, attachmentUrl, startDate, endDate);

      return response({ res, code: 201, message: "Leave request created successfully", data: newLeaveRequest });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  reviewLeaveRequests: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { approvalStatus } = req.body;
      const requestId = req.params.requestId;

      await attendanceService.reviewLeaveRequest(userId, requestId, approvalStatus);
      return response({ res, code: 200, message: "Leave request reviewed successfully" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceMonthly: async (req: Request, res: Response): Promise<any> => {
    try {
      const { month, year } = req.query;
      const monthNum = month ? parseInt(month as string) : undefined;
      const yearNum = year ? parseInt(year as string) : undefined;

      const attendances = await attendanceService.getAttendanceMonthly(monthNum, yearNum);
      const message = monthNum && yearNum ? "Monthly attendance retrieved successfully" : "Get all attendance success";

      return response({ res, code: 200, message, data: attendances });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;

      const summary = await attendanceService.getAttendanceSummary(yearNum, monthNum);
      return response({ res, code: 200, message: "Attendance summary retrieved successfully", data: summary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceByStatus: async (req: Request, res: Response): Promise<any> => {
    try {
      const { status, month, year } = req.query;
      const { id: userId } = req.params;
      const monthNum = month ? Number(month) : undefined;
      const yearNum = year ? Number(year) : undefined;

      const attendance = await attendanceService.getAttendanceByStatus(String(userId), String(status), monthNum, yearNum);

      return response({ res, code: 200, message: "Attendance details retrieved successfully", data: attendance });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  // New leave request fetching endpoints
  getAllLeaveRequests: async (req: Request, res: Response): Promise<any> => {
    try {
      const requests = await attendanceService.getAllLeaveRequests();

      return response({
        res,
        code: 200,
        message: "All leave requests retrieved successfully",
        data: requests,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getTodayLeaveRequests: async (req: Request, res: Response): Promise<any> => {
    try {
      const requests = await attendanceService.getTodayLeaveRequests();

      return response({
        res,
        code: 200,
        message: "Today's leave requests retrieved successfully",
        data: requests,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getLeaveRequestsByStatus: async (req: Request, res: Response): Promise<any> => {
    try {
      const { status } = req.query;

      const requests = await attendanceService.getLeaveRequestsByStatus(status as any);

      return response({
        res,
        code: 200,
        message: `Leave requests with status '${status}' retrieved successfully`,
        data: requests,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getLeaveRequestsByUser: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;

      const requests = await attendanceService.getLeaveRequestsByUserId(userId);

      return response({
        res,
        code: 200,
        message: "User leave requests retrieved successfully",
        data: requests,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default attendanceController;
