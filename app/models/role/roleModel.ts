import { model } from "mongoose";
import roleSchema from "./roleSchema";
import  IRole from "./roleInterface";

const Role = model<IRole>("Role", roleSchema);

export default Role;