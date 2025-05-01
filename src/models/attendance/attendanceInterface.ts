import { Types } from "mongoose"; 
import { attendanceStatus, approvalStatus } from "./attendanceSchema";

interface IAttendance {
  userId: Types.ObjectId; 
  date: Date;           
  status: attendanceStatus;  
  approvalStatus: approvalStatus;  
  reason?: string;  
  proveImage?: string;
  checkIn?: Date;
  checkOut?: Date;  
} 

export default IAttendance;