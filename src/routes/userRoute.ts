import { Router } from 'express';
import userController from '../controllers/userController';
const userRouter = Router();

userRouter.get('/get-users', userController.getAllUsers);
userRouter.get('/get-users/:id', userController.getUserById);
userRouter.delete('/:id', userController.deleteUser);
userRouter.patch('/update-role', userController.updateUserRole);
userRouter.patch('/update-user/:id', userController.updateUser);

export default userRouter;
