import { Request, Response } from "express";
import response from "../helper/response";
import attendanceRepository from "../repository/attendanceRepository";
import IAttendance from "../models/attendance/attendanceInterface";
import { approvalStatus } from "../models/attendance/attendanceInterface";
import { AuthRequest } from "../middlewares/authMiddlewares";
import attendanceValidate from "../validators/attendance.validator";

const attendanceController = {
  checkin: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;

      await attendanceValidate.checkIn(userId);

      const newAttendance: IAttendance = await attendanceRepository.createAttendance({
        userId,
        checkIn: new Date(),
        checkOut: null,
        approvalStatus: approvalStatus.ACCEPT,
      });

      return response({ res, code: 201, message: "Attendance created successfully", data: newAttendance });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  checkOut: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const userAttendance = await attendanceValidate.checkOut(userId);

      userAttendance.checkOut = new Date();
      await userAttendance.save();

      return res.status(200).json({ message: "Checkout success" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  submitLeaveOrSick: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { status, reason, proveImage, startDate, endDate } = req.body;

      await attendanceValidate.leaveOrSick(userId, status, reason, proveImage);

      const newAttendance: IAttendance = await attendanceRepository.createAttendance({
        userId,
        status,
        reason,
        proveImage,
        startDate,
        endDate,
        approvalStatus: approvalStatus.PENDING,
      });

      return response({ res, code: 201, message: "Attendance created successfully", data: newAttendance });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default attendanceController;
