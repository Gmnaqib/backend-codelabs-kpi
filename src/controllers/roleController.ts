import { Request, Response } from "express";
import Role from "../models/role/roleSchema";
import response from "../helper/response"; 

export const createRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return response({ res, code: 400, message: "Name and description are required", data: null});
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return response({ res, code: 400, message: "Role already exists", data: null});
    }

    const newRole = new Role({ name, description });
    await newRole.save();
    return response({ res, code: 201, message: "Role created successfully", data: newRole});

  } catch (error) {
    return response({ res, code: 500, message: "Error creating role", data: null});
  }
};

export const getAllRoles = async (req: Request, res: Response): Promise<any> => {
  try {
    const roles = await Role.find(); 
    return response({ res, code: 200, message: "Roles fetched successfully", data: roles});
  } catch (error) {
    console.error(error);
    return response({ res, code: 500, message: "Error fetching roles", data: null});
  }
};

export const getRoleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
    return response({ res, code: 404, message: "Role not found", data: null});
    }

    return response({ res, code: 200, message: "Role fetched successfully", data: role});

  } catch (error) {

    return response({ res, code: 500, message: "Error fetching roles", data: null});

  }
};

export const updateRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return response({ res, code: 400, message: "Name and description are required", data: null});
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedRole) {
      return response({ res, code: 404, message: "Role not found", data: null});
    }
      return response({ res, code: 200, message: "Role updated successfully", data: updatedRole});
  } catch (error) {
      return response({ res, code: 500, message: "Error updating role", data: null});
  }
};

export const deleteRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return response({ res, code: 404, message: "Role not found", data: null});
    }
      return response({ res, code: 200, message: "Role deleted successfully", data: role});
    
  } catch (error) {
      return response({ res, code: 500, message: "Error deleting role", data: null});

  }
};
