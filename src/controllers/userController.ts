import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewares";
import User from "../models/user/user.schema";
import response from "../helper/response";
import userRepository from "../repository/userRepository";
import bcrypt from "bcrypt";

const userController = {
  getAllUsers: async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await userRepository.findAll();
      return response({ res, code: 200, message: "Get all user success", data: users });
    } catch (error) {
      return response({ res, code: 500, message: "Error fetching users" });
    }
  },

  getUserById: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }
      return response({ res, code: 200, message: "User fetched successfully", data: user });
    } catch (error) {
      return response({ res, code: 500, message: "Error fetching user" });
    }
  },

  updateByUser: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { name, password } = req.body;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      user.name = name || user.name;

      await user.save();

      return response({ res, code: 200, message: "User updated successfully", data: user });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateByAdmin: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const { name, password, role, status, research, change_device_id } = req.body;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      if (name) user.name = name;
      if (password) user.password = password;
      if (role) user.role = role;
      if (status) user.status = status;
      if (research) user.research = research;
      if (change_device_id) user.change_device_id = change_device_id;

      await user.save();

      return response({ res, code: 200, message: "User updated successfully", data: user });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateDeviceId: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { device_id } = req.body;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }

      if (device_id && user.change_device_id === true) {
        user.device_id = device_id;
      } else {
        return response({ res, code: 404, message: "tidak bisa" });
      }

      user.change_device_id = false;

      await user.save();

      return response({ res, code: 200, message: "User updated successfully", data: user });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateUserRole: async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, role } = req.body;
      if (!userId || !role) {
        return response({ res, code: 400, message: "User ID and roleName are required" });
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }
      user.role = role;
      await user.save();

      return response({ res, code: 200, message: "User role updated successfully", data: user });
    } catch (error) {
      return response({ res, code: 500, message: "Error updating user role" });
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return response({ res, code: 404, message: "User not found" });
      }
      return response({ res, code: 200, message: "User deleted successfully", data: user });
    } catch (error) {
      return response({ res, code: 500, message: "Error deleting user" });
    }
  },
};

export default userController;
