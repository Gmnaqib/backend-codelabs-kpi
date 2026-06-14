import { Router } from "express";
import KPIItemController from "../controllers/kpi.item.controller";
import KPICountController from "../controllers/kpi.count.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const kpiItemRouter = Router();

// KPI Master
kpiItemRouter.post("/master", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.addMaster);
kpiItemRouter.get("/master", authenticateToken, KPIItemController.getAllMasters);
kpiItemRouter.get("/master/:kementerian/details", authenticateToken, KPIItemController.getMasterWithDetails);
kpiItemRouter.get("/master/:id", authenticateToken, KPIItemController.getMasterById);
kpiItemRouter.put("/master/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.updateMaster);
kpiItemRouter.delete("/master/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.deleteMaster);

// KPI Detail
kpiItemRouter.post("/detail", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.addDetail);
kpiItemRouter.get("/detail", authenticateToken, KPIItemController.getAllDetails);
kpiItemRouter.get("/detail/:masterId", authenticateToken, KPIItemController.getDetailsByMasterId);
kpiItemRouter.put("/detail/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.updateDetail);
kpiItemRouter.delete("/detail/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.deleteDetail);

// KPI Summary
kpiItemRouter.get("/me", authenticateToken, KPICountController.getMyKPISummary);
kpiItemRouter.get("/summary/:userId", authenticateToken, KPICountController.getKPISummaryByUserId);
kpiItemRouter.get("/", authenticateToken, KPICountController.getAllKPISummary);

export default kpiItemRouter;