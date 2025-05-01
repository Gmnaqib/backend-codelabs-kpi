import User from "../models/user/user.schema";
import IUser from "../models/user/user.interface";

export const createUser = (userData: IUser) => User.create(userData);
export const findUser = (filter: Partial<IUser>) => User.findOne(filter);