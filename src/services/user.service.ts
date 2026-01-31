import userRepository from "../repository/user.repository";
import userValidate from "../validators/user.validator";
import IUser, { Role, Status, Research } from "../models/user/user.interface";
import bcrypt from "bcrypt";

const userService = {
  getAllUsers: async (): Promise<IUser[]> => {
    return await userRepository.findAllUsers();
  },

  getUserById: async (userId: string): Promise<IUser> => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  updateByUser: async (userId: string, userData: { name?: string; password?: string }): Promise<IUser> => {
    await userValidate.updateByUser(userId, userData);
    const { name, password } = userData;
    const user = await userRepository.findUserById(userId, true);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user!.password = hashedPassword;
    }
    user!.name = name || user!.name;

    await user!.save();
    return user!;
  },

  updateByAdmin: async (
    userId: string,
    userData: {
      name?: string;
      password?: string;
      role?: Role;
      status?: Status;
      research?: Research;
      product_id?: string;
      change_device_id?: boolean;
    },
  ): Promise<IUser> => {
    await userValidate.updateByAdmin(userId, userData);

    const { name, password, role, status, research, product_id, change_device_id } = userData;
    const user = await userRepository.findUserById(userId, true);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user!.password = hashedPassword;
    }

    if (name) user!.name = name;
    if (role) user!.role = role;
    if (status) user!.status = status;
    if (research) user!.research = research;
    if (product_id) user!.product_id = product_id;
    if (change_device_id !== undefined) user!.change_device_id = change_device_id;

    await user!.save();
    return user!;
  },

  updateDeviceId: async (userId: string, deviceId: string): Promise<IUser> => {
    await userValidate.updateDeviceId(userId, deviceId);

    const user = await userRepository.findUserById(userId, true);

    user!.device_id = deviceId;
    user!.change_device_id = false;
    await user!.save();
    return user!;
  },

  updateUserRole: async (userId: string, role: Role): Promise<IUser> => {
    await userValidate.updateUserRole(userId, role);

    const user = await userRepository.findUserById(userId, true);

    user!.role = role;
    await user!.save();
    return user!;
  },

  deleteUser: async (userId: string): Promise<IUser | null> => {
    await userValidate.deleteUser(userId);

    const user = await userRepository.deleteUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};

export default userService;
