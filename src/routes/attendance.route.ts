import { Router } from "express";
import attendanceController from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const attendanceRouter = Router();

attendanceRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of operation", "user"]), attendanceController.getAttendanceMonthly);
attendanceRouter.get("/summary", authenticateToken, roleMiddlewares(["admin", "minister of operation", "user"]), attendanceController.getAttendanceSummary);
attendanceRouter.get("/summary/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation", "user"]), attendanceController.getAttendanceByStatus);

// New leave request fetching endpoints
attendanceRouter.post("/leave-requests", authenticateToken, attendanceController.submitLeaveOrSick);
attendanceRouter.get("/leave-requests", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.getAllLeaveRequests);
attendanceRouter.get("/leave-requests/today", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.getTodayLeaveRequests);
attendanceRouter.get("/leave-requests/status/:status", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.getLeaveRequestsByStatus);
attendanceRouter.get("/leave-requests/user", authenticateToken, attendanceController.getLeaveRequestsByUser);

attendanceRouter.post("/checkin", authenticateToken, attendanceController.checkin);
attendanceRouter.patch("/checkout", authenticateToken, attendanceController.checkOut);
attendanceRouter.patch("/leave-requests/review/:requestId", roleMiddlewares(["minister of operation"]), authenticateToken, attendanceController.reviewLeaveRequests);

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
