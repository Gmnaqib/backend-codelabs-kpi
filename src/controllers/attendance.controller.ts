import { Request, Response } from "express";
import response from "../helper/response";
import { AuthRequest } from "../middlewares/auth.middlewares";
import attendanceService from "../services/attendance.service";
import fileUploadService from "../services/fileUpload.service";
import attendanceRepository from "../repository/attendance.repository";
import dateHelper from "../helper/dateHelper";
import { Types } from "mongoose";

const attendanceController = {
  checkin: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const deviceData = req.body;
      const reason = req.body.reason;

      const result = await attendanceService.checkIn(userId, deviceData, reason);
      return response({ res, code: 201, message: "Checkin success", data: result });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  checkOut: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const deviceData = req.body;

      const result = await attendanceService.checkOut(userId, deviceData);
      return response({ res, code: 200, message: "Checkout success", data: result });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  submitLeaveOrSick: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { type, reason, start_date, end_date } = req.body;
      let attachment_url = req.body.attachment_url;

      const startOfDay = dateHelper.getStartOfDayWIB();
      const endOfDay = dateHelper.getEndOfDayWIB();

      const existingLeaveRequest = await attendanceRepository.findOne({
        userId: new Types.ObjectId(userId),
        start_date: { $gte: startOfDay, $lt: endOfDay } as any,
        approval_status: { $exists: true } as any,
      });

      if (existingLeaveRequest) {
        return response({ res, code: 400, message: "Anda sudah submit leave/sick request hari ini. Tidak bisa submit lagi" });
      }

      if (req.file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return response({ res, code: 400, message: "File must be image (JPEG, PNG, WebP)" });
        }
        attachment_url = await fileUploadService.uploadFile(req.file);
      }

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
      const userId = req.params.id as string;
      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const detailSummary = await attendanceService.getAttendanceSummaryDetail(new Types.ObjectId(userId), yearNum, monthNum);
      return response({ res, code: 200, message: "Attendance detail summary retrieved successfully", data: detailSummary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getAttendanceSummaryDetailMe: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 400, message: "User ID is required" });
      }
      const now = new Date();
      const year: number = now.getFullYear();
      const month: number = now.getMonth() + 1;

      const detailSummary = await attendanceService.getAttendanceSummaryDetail(new Types.ObjectId(userId), year, month);
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
      return response({ res, code: 200, message: "All sick leave requests retrieved successfully", data: requests });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  getLeaveRequestById: async (req: Request, res: Response): Promise<any> => {
    try {
      const requestId = req.params.id as string;
      const leaveRequest = await attendanceService.getLeaveRequestById(new Types.ObjectId(requestId));
      return response({ res, code: 200, message: "Get Leave request by ID success", data: leaveRequest });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  reviewLeaveRequests: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const reviewerUserId = req.user?.id;
      const { approvalStatus } = req.body;
      const attendanceId = req.params.requestId as string;
      await attendanceService.reviewLeaveRequest(reviewerUserId, new Types.ObjectId(attendanceId), approvalStatus);
      return response({ res, code: 200, message: "Leave request reviewed successfully" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  checkOutByMinister: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { userId, reasonCheckOut } = req.body;

      if (!userId) {
        return response({ res, code: 400, message: "Target user ID is required" });
      }

      if (!reasonCheckOut || reasonCheckOut.trim() === "") {
        return response({ res, code: 400, message: "Reason for checkout is required" });
      }

      const result = await attendanceService.checkOutByMinister(new Types.ObjectId(userId), reasonCheckOut);
      return response({ res, code: 200, message: "Checkout by minister success", data: result });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  submitLeaveByOperational: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const operationalUserId = req.user?.id;
      const { userId, type, reason, start_date, end_date } = req.body;
      let attachment_url = req.body.attachment_url;

      if (!userId) {
        return response({ res, code: 400, message: "Target user ID is required" });
      }

      if (!type || !["sick", "permit"].includes(type)) {
        return response({ res, code: 400, message: "Type must be 'sick' or 'permit'" });
      }

      if (!reason || reason.trim() === "") {
        return response({ res, code: 400, message: "Reason is required" });
      }

      if (!start_date || !end_date) {
        return response({ res, code: 400, message: "Start date and end date are required" });
      }

      if (req.file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return response({ res, code: 400, message: "File must be image (JPEG, PNG, WebP)" });
        }
        attachment_url = await fileUploadService.uploadFile(req.file);
      }

      const result = await attendanceService.submitLeaveByOperational(
        new Types.ObjectId(operationalUserId),
        new Types.ObjectId(userId),
        type,
        reason,
        new Date(start_date),
        new Date(end_date),
        attachment_url,
      );

      return response({ res, code: 201, message: "Leave request created by operational successfully", data: result });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default attendanceController;
