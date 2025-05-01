import { Router } from "express";
import { register, login, me, createMultipleUsers } from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddlewares";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/multiple-register", createMultipleUsers);
authRouter.post("/login", login);
authRouter.get("/me", authenticateToken, me);

export default authRouter;

