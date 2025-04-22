import { Router } from "express";
import { getAllUsers, updateUserRole, getUserById, deleteUser } from "../controllers/userController";
const userRouter = Router();

userRouter.get("/get-users", getAllUsers);
userRouter.get("/get-users/:id", getUserById);
userRouter.delete("/:id", deleteUser);
userRouter.put("/update-users-role", updateUserRole);


export default userRouter;
