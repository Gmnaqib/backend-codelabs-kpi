import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/authMiddlewares";
const userRouter = Router();

userRouter.get("/get-users", userController.getAllUsers);
userRouter.get("/get-users/:id", userController.getUserById);
userRouter.delete("/:id", userController.deleteUser);
userRouter.patch("/me/update", authenticateToken, userController.updateByUser);
userRouter.patch("/me/update-device", authenticateToken, userController.updateDeviceId);
userRouter.patch("/update-user/:id", userController.updateByAdmin);

export default userRouter;
