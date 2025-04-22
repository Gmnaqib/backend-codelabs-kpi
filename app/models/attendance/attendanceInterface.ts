import { Types } from "mongoose"; 
import { attendanceStatus, approvalStatus } from "./attendanceSchema";

interface IAttendance {
  userId: Types.ObjectId; 
  tanggal: Date;           
  status: attendanceStatus;  
  approvalStatus: approvalStatus;  
  reason: string;  
  buktiImageLink: string;  
  createdAt?: Date;  
  updatedAt?: Date;
} 

export default IAttendance;