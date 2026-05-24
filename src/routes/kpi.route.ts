import { Router } from "express";
import KPIItemController from "../controllers/kpi.item.controller";
import KPICountController from "../controllers/kpi.count.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const kpiItemRouter = Router();

// KPI CRUD Item routes
kpiItemRouter.post("/item", authenticateToken, KPIItemController.addKPIItem);
kpiItemRouter.get("/item", authenticateToken, KPIItemController.getAllKPIItems);

// KPI Count routes
kpiItemRouter.get("/research/me", authenticateToken, KPICountController.getMyResearchPointsSummary);
kpiItemRouter.get("/research/", authenticateToken, KPICountController.getResearchPointsSummary);
kpiItemRouter.get('/research-points-summary', KPICountController.getResearchPointsSummary);
kpiItemRouter.get('/research/my-points-summary', authenticateToken, KPICountController.getMyResearchPointsSummary);

kpiItemRouter.get("/operational/me", authenticateToken, KPICountController.getMyOperationalPointsSummary);
kpiItemRouter.get("/operational/", authenticateToken, KPICountController.getOperationalPointsSummary);

kpiItemRouter.get("/branding/me", authenticateToken, KPICountController.getMyBrandingPointsSummary);
kpiItemRouter.get("/branding/", authenticateToken, KPICountController.getBrandingPointsSummary);

kpiItemRouter.get("/competition/me", authenticateToken, KPICountController.getMyCompetitionPointsSummary);
kpiItemRouter.get("/competition/", authenticateToken, KPICountController.getCompetitionPointsSummary);

kpiItemRouter.get("/item/:id", authenticateToken, KPIItemController.getKPIItemById);
kpiItemRouter.put("/item/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.updateKPIItem);

kpiItemRouter.get("/statistic", authenticateToken, KPICountController.kpiStatistic);
kpiItemRouter.get("/summary/:userId", authenticateToken, KPICountController.getMyComprehensiveSummary);
kpiItemRouter.get("/me", authenticateToken, KPICountController.getMyTotalPointsSummary);
// kpiItemRouter.get("/summary", authenticateToken, KPICountController.getAllSummary);
kpiItemRouter.get("/", authenticateToken, KPICountController.getTotalPointsSummary);
export default kpiItemRouter;
