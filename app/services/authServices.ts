import User from "../models/user/userModel";
import IUser from "../models/user/userInterface";

export const createUser = (userData: IUser) => User.create(userData);