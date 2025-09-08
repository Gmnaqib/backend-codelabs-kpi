import { Router } from "express";
import settingController from "../controllers/setting.controller";
import { authenticateToken } from "../middlewares/authMiddlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const settingRouter = Router();

settingRouter.post("/", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), settingController.addSetting);
settingRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), settingController.findAllSetting);
settingRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), settingController.findSettingById);
settingRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), settingController.updateSetting);
settingRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), settingController.deleteSetting);

export default settingRouter;
