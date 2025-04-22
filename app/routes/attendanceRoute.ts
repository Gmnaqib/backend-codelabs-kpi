import { Router } from "express";
import { createAbsensi } from "../controllers/attendanceController";
import { authenticateToken } from "../middlewares/authMiddlewares";
const attendanceRouter = Router();

attendanceRouter.post("/checkin", createAbsensi);


export default attendanceRouter;

