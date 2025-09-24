import express from "express";
import scheduleController from "../controllers/schedule.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
import scheduleMiddlewareValidator from "../middlewares/schedule.middleware.validator";

const router = express.Router();

router.post("/", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, scheduleMiddlewareValidator.createSchedule, scheduleController.createSchedule);
router.get("/", authenticateToken, scheduleController.getAllSchedules);
router.get("/:id", authenticateToken, scheduleController.getScheduleById);
router.put("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, scheduleMiddlewareValidator.createSchedule, scheduleController.updateSchedule);
router.patch("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, scheduleController.partialUpdateSchedule);
router.delete("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, scheduleController.deleteSchedule);

export default router;
