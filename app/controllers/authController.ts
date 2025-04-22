import { createUser } from "../services/authServices";
import { Request, Response } from "express";
import IUser from "../models/user/userInterface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user/userModel";
import { AuthRequest } from "../middlewares/authMiddlewares";
import response from "../utils/responseUtils";
import Role from "../models/role/roleModel";  

// gumilar.10122155@mahasiswa.unikom.ac.id

export const createMultipleUsers = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const password: string = "password";
    const regex = /^([a-zA-Z]+)\.(\d{2})(\d{2})(\d{4})@mahasiswa\.unikom\.ac\.id$/;
    const match = email.match(regex);
    const name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    const nim = match[2] + match[3] + match[4];
    const role = await Role.findOne({ name: "User" });
    const majors = match[2];
    const years = `20${match[3]}`; 
    const status = "active";
    const research = "none";

    let jurusan = '';
        if (majors === '10') jurusan = 'Informatika';
        else if (majors === '111') jurusan = 'Sistem Informasi';
        else if (majors === '121') jurusan = 'Desain Komunikasi Visual';
        else jurusan = 'Unknown';

    console.log(majors);

    if (!role) {res.status(400).json({
        code: 400,
        status: "failed",
        message: "Role not found",
        data: null,
      });
      return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role._id, 
      nim,
      majors: jurusan,
      years,
      status,
      research,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
      message: "Error creating user, please try again later",
      data: null,
    });
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, roleName, nim, majors, years, status, research } = req.body;

    if (!name || !email || !password || !nim || !majors || !years) {
      res.status(400).json({
        code: 400,
        status: "failed",
        message: "All fields are required",
        data: null,
      });
      return;  
    }

    if (isNaN(nim)) {
      res.status(400).json({
        code: 400,
        status: "failed",
        message: "Invalid nim format",
        data: null,
      });
      return; 
    }

    const role = await Role.findOne({ name: roleName });

    if (!role) {res.status(400).json({
        code: 400,
        status: "failed",
        message: "Role not found",
        data: null,
      });
      return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role._id, 
      nim,
      majors,
      years,
      status,
      research,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "failed",
      message: "Error creating user, please try again later",
      data: null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       response(res, 400, "Email and password are required", null);
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      response(res, 401, "Invalid credentials", null);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      response(res, 401, "Invalid credentials", null);
      return; 
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, email: user.email, majors: user.majors, years: user.years, status: user.status, research: user.research },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      User: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      }
    });

  } catch (error) {
    response(res, 500, "Something went wrong during login", null);
  }
};

export const me = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    response(res, 401, "User not authenticated", null);
  }
  
    response(res, 200, "Get me success", req.user);
};