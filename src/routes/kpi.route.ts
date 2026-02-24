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
kpiItemRouter.get("/research/points-summary/me", authenticateToken, KPICountController.getMyResearchPointsSummary);
kpiItemRouter.get("/research/points-summary", authenticateToken, KPICountController.getResearchPointsSummary);

kpiItemRouter.get("/operational/points-summary/me", authenticateToken, KPICountController.getMyOperationalPointsSummary);
kpiItemRouter.get("/operational/points-summary", authenticateToken, KPICountController.getOperationalPointsSummary);

kpiItemRouter.get("/branding/points-summary/me", authenticateToken, KPICountController.getMyBrandingPointsSummary);
kpiItemRouter.get("/branding/points-summary", authenticateToken, KPICountController.getBrandingPointsSummary);

kpiItemRouter.get("/competition/points-summary/me", authenticateToken, KPICountController.getMyCompetitionPointsSummary);
kpiItemRouter.get("/competition/points-summary", authenticateToken, KPICountController.getCompetitionPointsSummary);

kpiItemRouter.get("/total-points/me", authenticateToken, KPICountController.getMyTotalPointsSummary);
kpiItemRouter.get("/total-points", authenticateToken, KPICountController.getTotalPointsSummary);

kpiItemRouter.get("/item/:id", authenticateToken, KPIItemController.getKPIItemById);
kpiItemRouter.put("/item/:id", authenticateToken, roleMiddlewares(["admin"]), KPIItemController.updateKPIItem);
// kpiRouter.get("/operational", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), KPIController.getAllOperationalSummary);
// kpiRouter.get("/operational/me", authenticateToken, KPIController.getOperationalSummary);
// kpiRouter.get("/operational/:userId", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), KPIController.getOperationalSummaryById);

// kpiRouter.get("/research", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), KPIController.getAllResearchSummary);
// kpiRouter.get("/research/me", authenticateToken, KPIController.getResearchSummary);
// kpiRouter.get("/research/:userId", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), KPIController.getResearchSummaryById);

// kpiRouter.get("/branding", authenticateToken, roleMiddlewares(["admin", "minister of branding", "lecturer"]), KPIController.getAllBrandingSummary);
// kpiRouter.get("/branding/me", authenticateToken, KPIController.getBrandingSummary);
// kpiRouter.get("/branding/:userId", authenticateToken, roleMiddlewares(["admin", "minister of branding", "lecturer"]), KPIController.getBrandingSummaryById);

// kpiRouter.get("/competition", authenticateToken, roleMiddlewares(["admin", "minister of competition", "lecturer"]), KPIController.getAllCompetitionSummary);
// kpiRouter.get("/competition/me", authenticateToken, KPIController.getCompetitionSummary);
// kpiRouter.get("/competition/:userId", authenticateToken, roleMiddlewares(["admin", "minister of competition", "lecturer"]), KPIController.getCompetitionSummaryById);

// kpiRouter.get("/", authenticateToken, KPIController.getAllTotalPointSummary);
kpiItemRouter.get("/statistic", authenticateToken, KPICountController.kpiStatistic);
// kpiRouter.get("/me", authenticateToken, KPIController.getTotalPointSummary);
// kpiRouter.get("/:userId", authenticateToken, KPIController.getTotalPointSummaryById);

export default kpiItemRouter;
