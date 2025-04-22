import { Request, Response } from "express";
import { attendance,attendanceStatus, approvalStatus  } from "../models/attendance/attendanceSchema"; 
import response from "../utils/responseUtils"; 

export const createAbsensi = async (req: Request, res: Response) => {
  try {
    const { userId, tanggal, status, reason, buktiImageLink } = req.body;

    if (!Object.values(attendanceStatus).includes(status)) {
      res.status(400).json({ message: "status for Kehadiran" });
    }

    if ((status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) && !reason) {
      res.status(400).json({ message: "alasan" });
    }

    if ((status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) && !buktiImageLink) {
      res.status(400).json({ message: "Image link" });
    }

    const newAbsensi = new attendance({
      userId,
      tanggal,
      status,
      reason,
      buktiImageLink,
      approvalStatus: (status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) ? approvalStatus.PENDING : approvalStatus.ACCEPT,
    });

    await newAbsensi.save();

    res.status(201).json({ message: "Absensi created successfully", data: newAbsensi });
  } catch (error) {
    response(res, 500, "Error creating role", null);
  }
};
