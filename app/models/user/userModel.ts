import { model } from "mongoose";
import userSchema from "./userSchema";
import  IUser from "./userInterface";

const User = model<IUser>("User", userSchema);

export default User;