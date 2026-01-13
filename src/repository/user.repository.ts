import User from "../models/user/user.schema";
import IUser, { Role, Status, Research } from "../models/user/user.interface";
import { Types } from "mongoose";

interface UserFilter {
  _id?: Types.ObjectId | string;
  name?: string;
  email?: string;
  nim?: string;
  majors?: string;
  years?: string;
  role?: Role;
  status?: Status;
  research?: Research;
  device_id?: string;
  change_device_id?: boolean;
  telegram_id?: string;
  telegram_username?: string;
}

const userRepository = {
  createUser: (userData: Partial<IUser>) => User.create(userData),
  findAllUsers: (includePassword: boolean = false) => (includePassword ? User.find() : User.find().select("-password")),
  findUserById: (id: string, includePassword: boolean = false) => (includePassword ? User.findById(id) : User.findById(id).select("-password")),
  findUser: (filter: UserFilter, includePassword: boolean = false) => (includePassword ? User.findOne(filter) : User.findOne(filter).select("-password")),
  findUsersByFilter: (filter: UserFilter, includePassword: boolean = false) => (includePassword ? User.find(filter) : User.find(filter).select("-password")),
  findUserByEmail: (email: string, includePassword: boolean = false) => userRepository.findUser({ email }, includePassword),
  findUserByNim: (nim: string, includePassword: boolean = false) => userRepository.findUser({ nim }, includePassword),
  findUserDevice: (id: Types.ObjectId) => User.findById(id).select("device_id"),
  updateUserById: (id: string, updateData: Partial<IUser>) => User.findByIdAndUpdate(id, updateData, { new: true }).select("-password"),
  updateUser: (filter: UserFilter, updateData: Partial<IUser>) => User.updateOne(filter, updateData),
  deleteUserById: (id: string) => User.findByIdAndDelete(id),
  deleteUser: (filter: UserFilter) => User.deleteOne(filter),
};

export default userRepository;
