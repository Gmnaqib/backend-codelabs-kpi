import { Router } from "express";
import competitionController from "../controllers/competition.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const competitionRouter = Router();

competitionRouter.post("/", authenticateToken, competitionController.addCompetition);
competitionRouter.get("/me", authenticateToken, competitionController.getMyCompetitions);
competitionRouter.patch("/me/:id", authenticateToken, competitionController.updateMyCompetitions);
competitionRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of competition"]), competitionController.findAllCompetition);
competitionRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of competition"]), competitionController.findCompetitionById);
competitionRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of competition"]), competitionController.updateCompetition);
competitionRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of competition"]), competitionController.deleteCompetition);

export default competitionRouter;
