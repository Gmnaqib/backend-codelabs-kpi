import { Request, Response } from 'express';
import response from '../helper/response';
import attendanceRepository from '../repository/attendanceRepository';
import IAttendance from '../models/attendance/attendanceInterface';
import { approvalStatus } from '../models/attendance/attendanceInterface';
import { AuthRequest } from '../middlewares/authMiddlewares';
import { getEndOfDayWIB, getStartOfDayWIB, getTimeTodayWIB, getNowWIBAsDateTime } from '../helper/dateHelper';

const attendanceController = {
  checkin: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const now = getNowWIBAsDateTime();
      const startOfDay = getStartOfDayWIB();
      const endOfDay = getEndOfDayWIB();

      const timeIn = getTimeTodayWIB(6);
      const timeLimit = getTimeTodayWIB(14);

      if (now < timeIn) {
        return response({ res, code: 400, message: 'bisa jam 6 sampai jam 9' });
      }

      if (now > timeLimit) {
        return response({ res, code: 400, message: 'sudah lewat' });
      }

      const userAttendance = await attendanceRepository.findAttendance({
        userId,
        checkIn: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (userAttendance) {
        return response({ res, code: 400, message: 'you checkin already' });
      }

      const newAttendance: IAttendance = await attendanceRepository.createAttendance({
        userId,
        checkIn: new Date(),
        checkOut: null,
        approvalStatus: approvalStatus.ACCEPT,
      });

      return response({
        res,
        code: 201,
        message: 'Attendance created successfully',
        data: newAttendance,
      });
    } catch (error) {
      return response({ res, code: 500, message: 'Error creating attendance' });
    }
  },

  checkOut: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const now = getNowWIBAsDateTime();
      const startOfDay = getStartOfDayWIB();
      const endOfDay = getEndOfDayWIB();
      const timeOut = getTimeTodayWIB(13);

      const userAttendance = await attendanceRepository.findAttendance({
        userId,
        checkIn: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (!userAttendance) {
        return response({ res, code: 400, message: 'you not checkin today' });
      }

      if (now < timeOut) {
        return response({ res, code: 400, message: 'checkout minimal jam 17:00' });
      }

      userAttendance.checkOut = new Date();
      await userAttendance.save();

      return res.status(200).json({ message: 'Checkout success' });
    } catch (error) {
      return response({ res, code: 500, message: 'Error updating attendance' });
    }
  },

  submitLeaveOrSick: async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, date, status, reason, proveImage } = req.body;

      if (status == 'present') {
        return response({ res, code: 400, message: 'Only leave or sick' });
      }

      if (status == 'sick' || status == 'leave') {
        if (!reason) {
          return response({ res, code: 400, message: 'Reason required' });
        }

        if (!proveImage) {
          return response({ res, code: 400, message: 'Image required' });
        }
      }

      const newAttendance: IAttendance = await attendanceRepository.createAttendance({
        userId,
        status,
        reason,
        proveImage,
        approvalStatus: approvalStatus.PENDING,
      });

      return response({ res, code: 201, message: 'Attendance created successfully', data: newAttendance });
    } catch (error) {
      return response({ res, code: 500, message: 'Error creating attendance' });
    }
  },
};

export default attendanceController;
