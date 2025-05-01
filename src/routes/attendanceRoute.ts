import { Router } from "express";
import { createAttendance } from "../controllers/attendanceController";
import { authenticateToken } from "../middlewares/authMiddlewares";
const attendanceRouter = Router();

attendanceRouter.post("/checkin", createAttendance);


export default attendanceRouter;

