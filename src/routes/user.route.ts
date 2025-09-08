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
