import { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
import upload from "../helper/fileUpload";
const userRouter = Router();

// Middleware untuk handle multer dengan error handling
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, function (err: any) {
    if (err) {
      return res.status(400).json({ code: 400, status: "failed", message: `Upload error: ${err.message}`, data: null });
    }
    next();
  });
};

userRouter.get("/", authenticateToken, userController.getAllUsers);
userRouter.get(
  "/:id",
  authenticateToken,
  roleMiddlewares(["admin", "lecturer", "president", "vice president", "vice president", "minister of research", "minister of competition", "minister of branding", "minister of operation"]),
  userController.getUserById,
);
userRouter.delete("/:id", roleMiddlewares(["admin", "lecturer"]), authenticateToken, userController.deleteUser);
userRouter.patch("/me", authenticateToken, uploadMiddleware, userController.updateByUser);
userRouter.patch("/me/update-device", authenticateToken, userController.updateDeviceId);
userRouter.patch("/:id", roleMiddlewares(["admin", "lecturer", "president", "vice president"]), authenticateToken, userController.updateByAdmin);

export default userRouter;
