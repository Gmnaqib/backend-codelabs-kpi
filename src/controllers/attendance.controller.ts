import { Request, Response } from "express";
import response from "../helper/response";
import attendanceRepository from "../repository/attendance.repository";
import leaveRequestRepository from "../repository/leave.request.repository";
import IAttendance from "../models/attendance/attendance.Interface";
import IleaveRequest, { approvalStatus } from "../models/attendance/leave.request.interface";
import { AuthRequest } from "../middlewares/authMiddlewares";
import attendanceValidate from "../validators/attendance.validator";
import LeaveRequest from "../models/attendance/leave.request.schema";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import { Types } from "mongoose";

const mapLeaveTypeToAttendanceStatus = (type: "sick" | "leave"): attendanceStatus => {
  switch (type) {
    case "sick":
      return attendanceStatus.SICK;
    case "leave":
      return attendanceStatus.LEAVE;
  }
};

const attendanceController = {
  checkin: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const device_id = req.body;

      await attendanceValidate.checkIn(userId, device_id);

      const newAttendance: IAttendance = await attendanceRepository.createAttendance({
        userId,
        date: new Date(),
        checkIn: new Date(),
        checkOut: null,
      });

      return response({ res, code: 201, message: "Checkin success" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  checkOut: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const device_id = req.body;
      await attendanceValidate.checkOut(userId, device_id);
      const userAttendance = await attendanceRepository.findAttendance({ userId });

      if (userAttendance) {
        userAttendance.checkOut = new Date();
        await userAttendance.save();
      } else {
        throw new Error("Attendance not found");
      }

      return response({ res, code: 200, message: "Checkout success" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  submitLeaveOrSick: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { type, reason, attachmentUrl, startDate, endDate } = req.body;

      await attendanceValidate.leaveOrSick(userId, type, reason, attachmentUrl, startDate, endDate);

      for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
        const existingAttendance = await attendanceRepository.findAttendance({
          userId,
          date: d,
        });

        if (existingAttendance) {
          throw new Error("Anda sudah absen pada tanggal " + d.toISOString().split("T")[0]);
        }
      }

      const newLeaveRequest: IleaveRequest = await leaveRequestRepository.create({
        userId,
        type,
        reason,
        attachmentUrl,
        startDate,
        endDate,
      });

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
      const objectId = new Types.ObjectId(requestId);

      const searchLeaveRequest = await leaveRequestRepository.findById(requestId);
      const startDate = searchLeaveRequest?.startDate;
      const endDate = searchLeaveRequest?.endDate;

      if (searchLeaveRequest?.approvalStatus == "approved" || searchLeaveRequest?.approvalStatus == "rejected") {
        return response({ res, code: 409, message: "Leave request has already been reviewed" });
      }

      const updateLeaveRequest = await leaveRequestRepository.updateOne({
        approvedBy: userId,
        approvalStatus: approvalStatus,
      });

      if (approvalStatus === "approved") {
        let currentDate = new Date(startDate!);
        while (currentDate <= endDate!) {
          const newAttendance: IAttendance = await attendanceRepository.createAttendance({
            userId,
            date: new Date(currentDate),
            status: mapLeaveTypeToAttendanceStatus(searchLeaveRequest!.type),
            leaveRequestId: objectId,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      return response({ res, code: 200, message: "Leave request reviewed successfully" });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default attendanceController;
