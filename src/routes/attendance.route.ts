import { Router } from "express";
import multer from "multer";
import attendanceController from "../controllers/attendance.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const attendanceRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
});

attendanceRouter.get("/", attendanceController.getAttendance);
attendanceRouter.get("/summary", authenticateToken, roleMiddlewares(["admin", "lecturer", "president", "vice president", "minister of operation"]), attendanceController.getAttendanceSummary);
attendanceRouter.get("/summary/me", authenticateToken, attendanceController.getAttendanceSummaryDetailMe);
attendanceRouter.get("/summary/:id", authenticateToken, attendanceController.getAttendanceSummaryDetail);

// Leave Request endpoints
attendanceRouter.post("/leave-requests", authenticateToken, upload.single("attachment"), attendanceController.submitLeaveOrSick);
attendanceRouter.get("/leave-requests", authenticateToken, roleMiddlewares(["admin", "lecturer", "president", "vice president", "minister of operation"]), attendanceController.getLeaveRequests);
attendanceRouter.get(
  "/leave-requests/:id",
  authenticateToken,
  roleMiddlewares(["admin", "lecturer", "president", "vice president", "minister of operation"]),
  attendanceController.getLeaveRequestById,
);

// Attendance endpoints
attendanceRouter.post("/checkin", authenticateToken, attendanceController.checkin);
attendanceRouter.patch("/checkout", authenticateToken, attendanceController.checkOut);
attendanceRouter.patch("/leave-requests/review/:requestId", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), attendanceController.reviewLeaveRequests);

export default attendanceRouter;
