import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/authMiddlewares";
const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/multiple-register", authController.createMultipleUsers);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticateToken, authController.me);

export default authRouter;
