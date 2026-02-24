import { Router } from "express";
import researchController from "../controllers/research.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const researchRouter = Router();

researchRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.getAllResearch);
researchRouter.get("/me", authenticateToken, researchController.getMyResearch);
researchRouter.get("/summary", authenticateToken, researchController.getResearchSummary);
researchRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.getResearchById);

// researchRouter.get("/me/summary", authenticateToken, researchController.getMyResearchSummary);

researchRouter.patch("/me/:id", authenticateToken, researchController.updateMyResearch);
researchRouter.post("/", authenticateToken, researchController.createResearch);
researchRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "president", "lecturer"]), researchController.deleteResearch);
researchRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.updateResearch);

export default researchRouter;
