import { Router } from "express";
import researchController from "../controllers/research.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const researchRouter = Router();

researchRouter.post("/", authenticateToken, researchController.createResearch);
researchRouter.get("/my", authenticateToken, researchController.getMyResearch);
researchRouter.get("/", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, researchController.getAllResearch);
researchRouter.get("/:id", authenticateToken, researchController.getResearchById);
researchRouter.patch("/:id", authenticateToken, researchController.updateResearch);
researchRouter.delete("/:id", authenticateToken, researchController.deleteResearch);

export default researchRouter;
