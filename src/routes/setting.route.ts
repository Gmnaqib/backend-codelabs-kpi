import { Router } from "express";
import settingController from "../controllers/setting.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const settingRouter = Router();

settingRouter.post("/", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), settingController.addSetting);
settingRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), settingController.findAllSetting);
settingRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), settingController.findSettingById);
settingRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), settingController.updateSetting);
settingRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), settingController.deleteSetting);

export default settingRouter;
