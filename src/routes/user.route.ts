import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/authMiddlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const userRouter = Router();

userRouter.get("/get-users", roleMiddlewares(["admin"]), authenticateToken, userController.getAllUsers);
userRouter.get("/get-users/:id", roleMiddlewares(["lecturer"]), authenticateToken, userController.getUserById);
userRouter.delete("/:id", roleMiddlewares(["admin"]), authenticateToken, userController.deleteUser);
userRouter.patch("/me/update", authenticateToken, userController.updateByUser);
userRouter.patch("/me/update-device", authenticateToken, userController.updateDeviceId);
userRouter.patch("/update-user/:id", roleMiddlewares(["admin"]), authenticateToken, userController.updateByAdmin);

export default userRouter;

// Admin = "admin",
//   Lecturer = "lecturer",
//   MinisterOfResearch = "minister of research",
//   MinisterOfCompetition = "minister of competition",
//   MinisterOfBranding = "minister of branding",
//   MinisterOfOperation = "minister of operation",
//   President = "president",
//   MinisterOfResearchAndOperation = "minister of research and operation",
//   MinisterOfResearchAndCompetition = "minister of research and competition",
//   VicePresident = "vice president",
//   User = "user",
