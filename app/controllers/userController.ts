import { Request, Response } from "express";
import User from "../models/user/userModel";
import response from "../utils/responseUtils";
import Role from "../models/role/roleModel";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate("role", "name");; 
    response(res, 200, "Users fetched successfully", users); 
  } catch (error) {
    response(res, 500, "Error fetching users", null);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      response(res, 404, "User not found", null);
    }
    response(res, 200, "User fetched successfully", user);
  } catch (error) {
    response(res, 500, "Error fetching user", null);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role, nim, majors, years, status, research } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, "User not found", null);
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

    response(res, 200, "User updated successfully", user);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error updating user", null);
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      response(res, 404, "User not found", null);
    }
    response(res, 200, "User deleted successfully", null);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error deleting user", null);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleName } = req.body;
    if (!userId || !roleName) {
      res.status(400).json({
        code: 400,
        status: "failed",
        message: "User ID and roleName are required",
        data: null,
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        code: 404,
        status: "failed",
        message: "User not found",
        data: null,
      });
      return; 
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      res.status(404).json({
        code: 404,
        status: "failed",
        message: "Role not found",
        data: null,
      });
      return;
    }

    user.role = role._id;
    await user.save();

    res.status(200).json({
      code: 200,
      status: "success",
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "failed",
      message: "Error updating user role",
      data: null,
    });
  }
};

