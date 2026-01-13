import { Router } from "express";
import attendanceController from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
// import { roleMiddlewares } from "../middlewares/role.middlewares";
const attendanceRouter = Router();

attendanceRouter.get("/", attendanceController.getAttendance);
attendanceRouter.get("/summary", authenticateToken, attendanceController.getAttendanceSummary);
attendanceRouter.get("/summary/:id", authenticateToken, attendanceController.getAttendanceSummaryDetail);

// // New leave request fetching endpoints
attendanceRouter.post("/leave-requests", authenticateToken, attendanceController.submitLeaveOrSick);
attendanceRouter.get("/leave-requests", authenticateToken, attendanceController.getLeaveRequests);
// attendanceRouter.get("/leave-requests/today", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.getTodayLeaveRequests);
// attendanceRouter.get("/leave-requests/status/:status", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.getLeaveRequestsByStatus);
// attendanceRouter.get("/leave-requests/:id", authenticateToken, attendanceController.getLeaveRequestById);

attendanceRouter.post("/checkin", authenticateToken, attendanceController.checkin);
attendanceRouter.patch("/checkout", authenticateToken, attendanceController.checkOut);
attendanceRouter.patch("/leave-requests/review/:requestId", authenticateToken, attendanceController.reviewLeaveRequests);

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
