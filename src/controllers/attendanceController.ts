import { Request, Response } from "express";
import { Attendance,attendanceStatus, approvalStatus  } from "../models/attendance/attendanceSchema"; 
import response from "../helper/response"; 

export const createAttendance = async (req: Request, res: any) => {
  try {
    const { userId, date, status, reason, proveImage } = req.body;

    if (!Object.values(attendanceStatus).includes(status)) {
      return response({ res, code: 400, message: "status for attendance", data: null});
      
      
    }
    const isValidStatus = Object.values(attendanceStatus).includes(status);
    if (!isValidStatus) {
      return res.status(400).json({ message: "Need reason" });
      // return response(res, 400, "apalah", null)
    }

    if ((status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) && !proveImage) {
      return res.status(400).json({ message: "Image link" });
      
    }

    const newAttendance = new Attendance({
      userId,
      date,
      status,
      reason,
      proveImage,
      checkIn: new Date(),
      checkOut: null,
      approvalStatus: (status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) ? approvalStatus.PENDING : approvalStatus.ACCEPT,
    });

    await newAttendance.save();

    return response({ res, code: 201, message:  "Attendance created successfully", data: newAttendance});

  } catch (error) {

    return response({ res, code: 500, message: "Error creating attendance", data: null});

  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { attendanceId, status, reason, proveImage } = req.body;

    if (!Object.values(attendanceStatus).includes(status)) {

    return response({ res, code: 400, message:"status for attendance", data: null});

    }
    const isValidStatus = Object.values(attendanceStatus).includes(status);
    if (!isValidStatus) {
      return res.status(400).json({ message: "Need reason" });
    }

    if ((status === attendanceStatus.SICK || status === attendanceStatus.EXCUSE) && !proveImage) {
      return res.status(400).json({ message: "Image link" });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { status, reason, proveImage },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    return res.status(200).json({ message: "Attendance updated successfully", data: updatedAttendance });
  } catch (error) {

    return response({ res, code: 500, message:"Error updating attendance", data: null});

  }
}