import { Schema, model } from "mongoose";
import IRole from "./roleInterface";  // Mengimpor interface IRole

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Role = model<IRole>("Role", roleSchema);

export default Role;
