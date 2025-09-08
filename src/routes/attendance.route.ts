import { Router } from "express";
import attendanceController from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/authMiddlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const attendanceRouter = Router();

attendanceRouter.post("/checkin", authenticateToken, attendanceController.checkin);
attendanceRouter.post("/request", authenticateToken, attendanceController.submitLeaveOrSick);
attendanceRouter.patch("/checkout", authenticateToken, attendanceController.checkOut);
attendanceRouter.patch("/request/review/:requestId", roleMiddlewares(["minister of operation"]), authenticateToken, attendanceController.reviewLeaveRequests);

export default attendanceRouter;

// Admin = "admin",
//   Lecturer = "lecturer",
//   MinisterOfResearch = "minister of research",
//   MinisterOfCompetition = "minister of competition",
//   MinisterOfBranding = "minister of branding",
//   MinisterOfOperation = "minister of operation",
//   President = "president",
//   MinisterOfResearchAndOperation = "minister of research and operation",
//   MinisterOfResearchAndCompetition = "minister of research and competition",
//   VicePresident = "vice president",
//   User = "user",
