import User from "../models/user/user.schema";
import IUser from "../models/user/user.interface";
import { Types } from "mongoose";

// Type-safe filter and update interfaces
interface UserFilter {
  _id?: Types.ObjectId | string;
  name?: string;
  email?: string;
  nim?: string;
  majors?: string;
  years?: string;
  role?: string;
  status?: string;
  research?: string;
  device_id?: string;
  change_device_id?: boolean;
}

interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  research?: string;
  device_id?: string;
  change_device_id?: boolean;
  telegram_id?: string;
  telegram_username?: string;
}

const userRepository = {
  createUser: (userData: Partial<IUser>) => User.create(userData),

  findAllUsers: (includePassword: boolean = false) => (includePassword ? User.find() : User.find().select("-password")),

  findUsersByFilter: (filter: UserFilter, includePassword: boolean = false) => (includePassword ? User.find(filter) : User.find(filter).select("-password")),

  findUserById: (id: string, includePassword: boolean = false) => (includePassword ? User.findById(id) : User.findById(id).select("-password")),

  findUser: (filter: UserFilter, includePassword: boolean = false) => (includePassword ? User.findOne(filter) : User.findOne(filter).select("-password")),

  updateUser: (filter: UserFilter, updateData: UserUpdate) => User.updateOne(filter, updateData),

  updateUserById: (id: string, updateData: UserUpdate) => User.findByIdAndUpdate(id, updateData, { new: true }).select("-password"),

  deleteUser: (id: string) => User.findByIdAndDelete(id),

  findUserDevice: (id: string) => User.findById(id).select("device_id"),

  // Specific helper methods
  findUserByNim: (nim: string, includePassword: boolean = false) => userRepository.findUser({ nim }, includePassword),

  findUserByEmail: (email: string, includePassword: boolean = false) => userRepository.findUser({ email }, includePassword),

  updateUserPassword: (id: string, hashedPassword: string) => User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).select("-password"),

  updateUserDeviceId: (id: string, deviceId: string) => User.findByIdAndUpdate(id, { device_id: deviceId }, { new: true }).select("-password"),
};

export default userRepository;
