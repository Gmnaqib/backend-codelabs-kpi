import userRepository from "../repository/user.repository";
import { AuthRequest } from "../middlewares/authMiddlewares";
import { Request, Response } from "express";
import IUser from "../models/user/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import response from "../helper/response";
import "dotenv/config";

const authController = {
  createMultipleUsers: async (req: Request, res: Response): Promise<any> => {
    try {
      const data = req.body;
      const emailArray = data.emails;
      const password: string = "password";

      if (!emailArray || emailArray.length === 0) {
        return response({ res, code: 400, message: "Email list is empty" });
      }

      const createdUsers: IUser[] = [];
      const skippedUsers: string[] = [];

      for (const email of emailArray) {
        let [name, rest] = email.split(".");
        let nim = rest.split("@")[0];
        let majors = nim.substring(0, 3);
        let years = "20" + nim.substring(3, 5);

        let major = "";
        if (majors === "101") major = "Informatika";
        else if (majors === "111") major = "Sistem Informasi";
        else if (majors === "121") major = "Desain Komunikasi Visual";
        else major = "Unknown";

        const existingUser = await userRepository.findUser({ nim });

        if (existingUser) {
          skippedUsers.push(email);
          continue;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = await userRepository.createUser({
          name,
          email,
          password: hashedPassword,
          nim,
          majors: major,
          years,
        });

        createdUsers.push(newUser);
      }

      return response({ res, code: 201, message: `${createdUsers.length} user(s) created successfully, ${skippedUsers.length} user(s) failed`, data: createdUsers });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  register: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password, nim, majors, years, research, telegram_id, telegram_username } = req.body;

      const existingUser = await userRepository.findUser({ nim });

      if (existingUser) {
        return response({ res, code: 400, message: "NIM Registered" });
      }

      if (!name || !email || !password || !nim || !majors || !years) {
        return response({ res, code: 400, message: "All fields are required" });
      }

      if (isNaN(nim)) {
        return response({ res, code: 400, message: "Invalid nim format" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: IUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        nim,
        majors,
        years,
        research,
        telegram_id,
        telegram_username,
      });

      return response({ res, code: 201, message: "User created successfully", data: newUser });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { nim, password } = req.body;

      if (!nim || !password) {
        return response({ res, code: 400, message: "nim and password are required" });
      }

      const user = await userRepository.findUser({ nim });

      if (!user) {
        return response({ res, code: 401, message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return response({ res, code: 401, message: "Invalid credentials" });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          role: user.role,
          nim: user.nim,
          majors: user.majors,
          years: user.years,
          status: user.status,
          research: user.research,
          device_id: user.device_id,
        },
        secret,
        { expiresIn: "1d" }
      );

      return response({
        res,
        code: 200,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          nim: user.nim,
          role: user.role,
          token,
        },
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  me: (req: AuthRequest, res: Response): any => {
    if (!req.user) {
      return response({ res, code: 401, message: "User not authenticated" });
    }
    return response({ res, code: 200, message: "Get me success", data: req.user });
  },
};

export default authController;
