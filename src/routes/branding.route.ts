import { Router } from "express";
import brandingController from "../controllers/branding.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const brandingRouter = Router();

brandingRouter.post("/", authenticateToken, brandingController.addBranding);
brandingRouter.get("/", authenticateToken, brandingController.findAllBrandings);
brandingRouter.get("/:id", authenticateToken, brandingController.findBrandingById);
brandingRouter.patch("/:id", authenticateToken, brandingController.updateBranding);
brandingRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research and competition"]), brandingController.deleteBranding);

export default brandingRouter;
