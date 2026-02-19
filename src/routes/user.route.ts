import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const userRouter = Router();

userRouter.get("/", authenticateToken, userController.getAllUsers);
userRouter.get(
  "/:id",
  authenticateToken,
  roleMiddlewares(["admin", "lecturer", "president", "vice president", "vice president", "minister of research", "minister of competition", "minister of branding", "minister of operation"]),
  userController.getUserById,
);
userRouter.delete("/:id", roleMiddlewares(["admin", "lecturer"]), authenticateToken, userController.deleteUser);
userRouter.patch("/me/update", authenticateToken, userController.updateByUser);
userRouter.patch("/me/update-device", authenticateToken, userController.updateDeviceId);
userRouter.patch("/:id", roleMiddlewares(["admin", "lecturer", "president", "vice president"]), authenticateToken, userController.updateByAdmin);

export default userRouter;
