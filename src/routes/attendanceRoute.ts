import { Router } from "express";
import attendanceController from "../controllers/attendanceController";
import { authenticateToken } from "../middlewares/authMiddlewares";
const attendanceRouter = Router();

attendanceRouter.post("/checkin", authenticateToken, attendanceController.checkin);
attendanceRouter.post("/request", authenticateToken, attendanceController.submitLeaveOrSick);
attendanceRouter.patch("/checkout", authenticateToken, attendanceController.checkOut);

export default attendanceRouter;
