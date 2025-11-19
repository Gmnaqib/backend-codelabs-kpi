import { Router } from "express";
import competitionController from "../controllers/competition.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const competitionRouter = Router();

competitionRouter.post("/", authenticateToken, competitionController.addCompetition);
competitionRouter.get("/", authenticateToken, competitionController.findAllCompetition);
competitionRouter.get("/me", authenticateToken, competitionController.getMyCompetitions);
competitionRouter.get("/:id", authenticateToken, competitionController.findCompetitionById);
competitionRouter.patch("/:id", authenticateToken, competitionController.updateCompetition);
competitionRouter.patch("/me/:id", authenticateToken, competitionController.updateMyCompetitions);
competitionRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research and competition"]), competitionController.deleteCompetition);

export default competitionRouter;
