import { Router } from "express";
import KPIController from "../controllers/kpi.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const kpiRouter = Router();

kpiRouter.get("/operational", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), KPIController.getAllOperationalSummary);
kpiRouter.get("/operational/me", authenticateToken, KPIController.getOperationalSummary);
kpiRouter.get("/operational/:userId", authenticateToken, roleMiddlewares(["admin", "minister of operation", "lecturer"]), KPIController.getOperationalSummaryById);

kpiRouter.get("/research", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), KPIController.getAllResearchSummary);
kpiRouter.get("/research/me", authenticateToken, KPIController.getResearchSummary);
kpiRouter.get("/research/:userId", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), KPIController.getResearchSummaryById);

kpiRouter.get("/branding", authenticateToken, roleMiddlewares(["admin", "minister of branding", "lecturer"]), KPIController.getAllBrandingSummary);
kpiRouter.get("/branding/me", authenticateToken, KPIController.getBrandingSummary);
kpiRouter.get("/branding/:userId", authenticateToken, roleMiddlewares(["admin", "minister of branding", "lecturer"]), KPIController.getBrandingSummaryById);

kpiRouter.get("/competition", authenticateToken, roleMiddlewares(["admin", "minister of competition", "lecturer"]), KPIController.getAllCompetitionSummary);
kpiRouter.get("/competition/me", authenticateToken, KPIController.getCompetitionSummary);
kpiRouter.get("/competition/:userId", authenticateToken, roleMiddlewares(["admin", "minister of competition", "lecturer"]), KPIController.getCompetitionSummaryById);

kpiRouter.get("/", authenticateToken, KPIController.getAllTotalPointSummary);
kpiRouter.get("/statistic", authenticateToken, KPIController.kpiStatistic);
kpiRouter.get("/me", authenticateToken, KPIController.getTotalPointSummary);
kpiRouter.get("/:userId", authenticateToken, KPIController.getTotalPointSummaryById);

export default kpiRouter;
