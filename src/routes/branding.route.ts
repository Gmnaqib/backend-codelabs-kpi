import { Router } from "express";
import brandingController from "../controllers/branding.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const brandingRouter = Router();

brandingRouter.post("/", authenticateToken, brandingController.addBranding);
brandingRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of branding"]), brandingController.findAllBrandings);
brandingRouter.get("/me", authenticateToken, brandingController.getMyBrandings);
brandingRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of branding"]), brandingController.findBrandingById);
brandingRouter.get("/me/stats", authenticateToken, brandingController.getMyBrandingStats);
brandingRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of branding"]), brandingController.updateBranding);
brandingRouter.patch("/me/:id", authenticateToken, brandingController.updateMybrandings);
brandingRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of branding"]), brandingController.deleteBranding);

export default brandingRouter;
