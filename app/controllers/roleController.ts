import { Request, Response } from "express";
import Role from "../models/role/roleModel";
import response from "../utils/responseUtils"; 

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      response(res, 400, "Name and description are required", null);
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      response(res, 400, "Role already exists", null);
    }

    const newRole = new Role({ name, description });
    await newRole.save();

    response(res, 201, "Role created successfully", newRole);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error creating role", null);
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();  // Mengambil semua role
    response(res, 200, "Roles fetched successfully", roles);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error fetching roles", null);
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      response(res, 404, "Role not found", null);
    }

    response(res, 200, "Role fetched successfully", role);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error fetching role", null);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      response(res, 400, "Name and description are required", null);
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedRole) {
      response(res, 404, "Role not found", null);
    }

    response(res, 200, "Role updated successfully", updatedRole);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error updating role", null);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      response(res, 404, "Role not found", null);
    }

    response(res, 200, "Role deleted successfully", null);
  } catch (error) {
    console.error(error);
    response(res, 500, "Error deleting role", null);
  }
};
