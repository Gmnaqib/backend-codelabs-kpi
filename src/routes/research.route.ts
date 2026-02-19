import { Router } from "express";
import researchController from "../controllers/research.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const researchRouter = Router();

researchRouter.get("/me", authenticateToken, researchController.getMyResearch);
researchRouter.patch("/me/:id", authenticateToken, researchController.updateMyResearch);
researchRouter.post("/", authenticateToken, researchController.createResearch);
researchRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "president", "lecturer"]), researchController.deleteResearch);
researchRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.getAllResearch);
researchRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.getResearchById);
researchRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer"]), researchController.updateResearch);

export default researchRouter;
