import userRepository from "../repository/user.repository";
import { Types } from "mongoose";
import { Role, Status, Research } from "../models/user/user.interface";

export const userValidate = {
  updateByUser: async (userId: string, userData: { name?: string; password?: string }): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const { name, password } = userData;

    // At least one field must be provided
    if (!name && !password) {
      throw new Error("At least one field (name or password) must be provided");
    }

    // Validate name if provided
    if (name !== undefined && (!name || name.trim().length === 0)) {
      throw new Error("Name cannot be empty");
    }

    // Validate password if provided
    if (password !== undefined && (!password || password.length < 6)) {
      throw new Error("Password must be at least 6 characters long");
    }

    const user = await userRepository.findUserById(userId, true);

    if (!user) {
      throw new Error("User not found");
    }
  },

  updateByAdmin: async (
    userId: string,
    userData: {
      name?: string;
      password?: string;
      role?: Role;
      status?: Status;
      research?: Research;
      change_device_id?: boolean;
    }
  ): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const { name, password, role, status, research, change_device_id } = userData;

    // At least one field must be provided
    if (!name && !password && !role && !status && !research && change_device_id === undefined) {
      throw new Error("At least one field must be provided for update");
    }

    // Validate name if provided
    if (name !== undefined && (!name || name.trim().length === 0)) {
      throw new Error("Name cannot be empty");
    }

    // Validate password if provided
    if (password !== undefined && (!password || password.length < 6)) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Validate role if provided
    if (role !== undefined && !["admin", "user"].includes(role)) {
      throw new Error("Invalid role. Must be 'admin' or 'user'");
    }

    // Validate status if provided
    if (status !== undefined && !["active", "inactive"].includes(status)) {
      throw new Error("Invalid status. Must be 'active' or 'inactive'");
    }

    // Validate research if provided
    if (research !== undefined && !["frontend", "backend", "mobile", "uiux", "devops"].includes(research)) {
      throw new Error("Invalid research. Must be one of: frontend, backend, mobile, uiux, devops");
    }

    const user = await userRepository.findUserById(userId, true);

    if (!user) {
      throw new Error("User not found");
    }
  },

  updateDeviceId: async (userId: string, deviceId: string): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!deviceId) {
      throw new Error("Device ID is required");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    if (deviceId.trim().length === 0) {
      throw new Error("Device ID cannot be empty");
    }

    const user = await userRepository.findUserById(userId, true);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.change_device_id !== true) {
      throw new Error("tidak bisa");
    }
  },

  updateUserRole: async (userId: string, role: Role): Promise<void> => {
    if (!userId || !role) {
      throw new Error("User ID and roleName are required");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    // Validate role
    if (!["admin", "user"].includes(role)) {
      throw new Error("Invalid role. Must be 'admin' or 'user'");
    }

    const user = await userRepository.findUserById(userId, true);

    if (!user) {
      throw new Error("User not found");
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }
  },
};

export default userValidate;
