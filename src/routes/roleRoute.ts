// routes/roleRoutes.ts
import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/roleController";

const roleRouter = Router();

roleRouter.post("/", createRole);
roleRouter.get("/", getAllRoles);
roleRouter.get("/roles/:id", getRoleById);
roleRouter.put("/roles/:id", updateRole);
roleRouter.delete("/roles/:id", deleteRole);

export default roleRouter;
