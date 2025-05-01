import { Request, Response } from "express";
import User from "../models/user/user.schema";
import response from "../helper/response";
import Role from "../models/role/roleSchema";

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find().populate("role", "name");; 
    return response({ res, code: 200, message: "Users fetched successfully", data: users});
  } catch (error) {
    return response({ res, code: 500, message: "Error fetching users", data: null});
  }
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return response({ res, code: 404, message: "User not found", data: null});
    }
      return response({ res, code: 200, message: "User fetched successfully", data: user});
  } catch (error) {
    return response({ res, code: 500, message: "Error fetching user", data: null});
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { name, email, password, role, nim, majors, years, status, research } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return response({ res, code: 404, message: "User not found", data: null});
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password; 
    user.role = role || user.role;
    user.nim = nim || user.nim;
    user.majors = majors || user.majors;
    user.years = years || user.years;
    user.status = status || user.status;
    user.research = research || user.research;
    user.updatedAt = new Date();
    await user.save();

    return response({ res, code: 200, message: "User updated successfully", data: user});
  } catch (error) {
    return response({ res, code: 500, message: "Error updating user", data: null});
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return response({ res, code: 404, message: "User not found", data: null});
    }
      return response({ res, code: 200, message: "User deleted successfully", data: user});
  } catch (error) {
    return response({ res, code: 500, message: "Error deleting user", data: null});
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, roleName } = req.body;
    if (!userId || !roleName) {
    return response({ res, code: 400, message: "User ID and roleName are required", data: null});
    }

    const user = await User.findById(userId);
    
    if (!user) {
    return response({ res, code: 404, message: "User not found", data: null});
    }

    const role = await Role.findOne({ name: roleName });
    
    if (!role) {
    return response({ res, code: 404, message: "Role not found", data: null});
    }

    user.role = role._id;
    await user.save();

    return response({ res, code: 200, message: "User role updated successfully", data: user});
  } catch (error) {
    return response({ res, code: 500, message: "Error updating user role", data: null});
  }
};

