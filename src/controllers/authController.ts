import { createUser, findUser } from "../repository/userRepository";
import { AuthRequest } from "../middlewares/authMiddlewares";
import { Request, Response } from "express";
import IUser from "../models/user/user.interface";
import Role from "../models/role/roleSchema";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import response from "../helper/response";
import 'dotenv/config';

// gumilar.10122155@mahasiswa.unikom.ac.id

export const createMultipleUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body; 
    const emailArray = data.emails;  
    const password: string = "password";

    if (!emailArray || emailArray.length === 0) {
      return response({ res, code: 400, message: "Email list is empty", data: null });
    }

    const role = await Role.findOne({ name: "User" });
    if (!role) {
      return response({ res, code: 400, message: "Role not found", data: null });
    }

    const createdUsers: IUser[] = [];  

    for (const email of emailArray) {
      let [name, rest] = email.split(".");
      let nim = rest.split("@")[0];
      let majors = nim.substring(0, 3);
      let years = "20" + nim.substring(3, 5);
      let status = "active";
      let research = "none";

      let major = '';
      if (majors === '101') major = 'Informatika';
      else if (majors === '111') major = 'Sistem Informasi';
      else if (majors === '121') major = 'Desain Komunikasi Visual';
      else major = 'Unknown';

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: IUser = await createUser({
        name,
        email,
        password: hashedPassword,
        role: role._id,
        nim,
        majors: major,
        years,
        status,
        research,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      createdUsers.push(newUser);  
    }

    return response({ res, code: 201, message: `${createdUsers.length} user(s) created successfully`, data: createdUsers });
  } catch (error) {
    return response({ res, code: 500, message: "Error creating users", data: null});
  }
};


export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, roleName, nim, majors, years, status, research, telegram_id, telegram_username } = req.body;

    if (!name || !email || !password || !nim || !majors || !years) {
    return response({ res, code: 400, message: "All fields are required" , data: null });
    }

    if (isNaN(nim)) {
    return response({ res, code: 400, message: "Invalid nim format" , data: null });
    }

    const role = await Role.findOne({ name: roleName });

    if (!role) {
    return response({ res, code: 400, message: "Role not found" , data: null });
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
      telegram_id,
      telegram_username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return response({ res, code: 201, message: "User created successfully", data: newUser });
  } catch (error:any) {
    return response({ res, code: 500, message: "Create user error", data: null });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nim, password } = req.body;

    if (!nim || !password) {
      return response({ res, code: 400, message: "nim and password are required", data: null});
    }

    const user = await findUser({ nim });


    if (!user) {
      return response({ res, code: 401, message: "Invalid credentials", data: null});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response({ res, code: 401, message: "Invalid credentials", data: null});
    }

    const secret =  process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user._id,
        name: user.name,
        role: user.role,
        nim: user.nim,
        majors: user.majors,
        years: user.years,
        status: user.status,
        research: user.research },
        secret, { expiresIn: "1d" }
    );

    return response({ res, code: 200, message: "Login successful", data: {
        id: user._id,
        name: user.name,
        nim: user.nim,
        role: user.role,
        token,
      } });

  } catch (error) {
    return response({ res, code: 500, message: "Something went wrong during login", data: null});
  }
};

export const me = (req: AuthRequest, res: Response): any => {
  if (!req.user) {
    return response({ res, code: 401, message: "User not authenticated", data: null});
  }
    return response({ res, code: 200, message: "Get me success", data: req.user});
};