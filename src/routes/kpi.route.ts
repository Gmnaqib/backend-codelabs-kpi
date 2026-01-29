import { Router } from "express";
import KPIController from "../controllers/kpi.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
const kpiRouter = Router();

kpiRouter.get("/operational", authenticateToken, KPIController.getAllKPISummary);
kpiRouter.get("/operational/me", authenticateToken, KPIController.getKPISummary);
kpiRouter.get("/operational/:userId", authenticateToken, KPIController.getKPISummaryById);

kpiRouter.get("/research", authenticateToken, KPIController.getAllResearchSummary);
kpiRouter.get("/research/me", authenticateToken, KPIController.getResearchSummary);
kpiRouter.get("/research/:userId", authenticateToken, KPIController.getResearchSummaryById);

kpiRouter.get("/branding", authenticateToken, KPIController.getAllBrandingSummary);
kpiRouter.get("/branding/me", authenticateToken, KPIController.getBrandingSummary);
kpiRouter.get("/branding/:userId", authenticateToken, KPIController.getBrandingSummaryById);

kpiRouter.get("/competition", authenticateToken, KPIController.getAllCompetitionSummary);
kpiRouter.get("/competition/me", authenticateToken, KPIController.getCompetitionSummary);
kpiRouter.get("/competition/:userId", authenticateToken, KPIController.getCompetitionSummaryById);

kpiRouter.get("/", authenticateToken, KPIController.getAllTotalPointSummary);
kpiRouter.get("/me", authenticateToken, KPIController.getTotalPointSummary);
kpiRouter.get("/:userId", authenticateToken, KPIController.getTotalPointSummaryById);

export default kpiRouter;
