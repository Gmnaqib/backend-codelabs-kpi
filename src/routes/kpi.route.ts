import { Router } from "express";
import KPIController from "../controllers/kpi.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
const kpiRouter = Router();

kpiRouter.post("/", authenticateToken, KPIController.addKPI);
kpiRouter.get("/", authenticateToken, KPIController.findAllKPIs);
kpiRouter.get("/:id", authenticateToken, KPIController.findKPIById);
kpiRouter.patch("/:id", authenticateToken, KPIController.updateKPI);

export default kpiRouter;
