import { model } from "mongoose";
import {attendanceSchema} from "./attendanceSchema";
import IAttendance from "./attendanceInterface"; 

const Attendance = model<IAttendance>("Attendace", attendanceSchema);

export default Attendance;
