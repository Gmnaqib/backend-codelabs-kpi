import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const userRouter = Router();

userRouter.get("/", authenticateToken, userController.getAllUsers);
userRouter.get("/:id", roleMiddlewares(["admin", "lecturer"]), authenticateToken, userController.getUserById);
userRouter.delete("/:id", roleMiddlewares(["admin"]), authenticateToken, userController.deleteUser);
userRouter.patch("/me/update", authenticateToken, userController.updateByUser);
userRouter.patch("/me/update-device", authenticateToken, userController.updateDeviceId);
userRouter.patch("/:id", roleMiddlewares(["admin"]), authenticateToken, userController.updateByAdmin);

export default userRouter;
