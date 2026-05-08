import { AuthRequest } from "../middlewares/auth.middlewares";
import { Request, Response } from "express";
import response from "../helper/response";
import authService from "../services/auth.service";

const authController = {
  createMultipleUsers: async (req: Request, res: Response): Promise<any> => {
    try {
      const data = req.body;
      const emailArray = data.emails;

      const { createdUsers, skippedUsers } = await authService.createMultipleUsers(emailArray);

      return response({
        res,
        code: 201,
        message: `${createdUsers.length} user(s) created successfully, ${skippedUsers.length} user(s) failed`,
        data: createdUsers,
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  register: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password, nim, majors, years, research, telegram_id, telegram_username } = req.body;

      const newUser = await authService.register({
        name,
        email,
        password,
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

      const { user, token } = await authService.login(nim, password);

      return response({
        res,
        code: 200,
        message: "Login successful",
        data: {
          ...user,
          token,
        },
      });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  me: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userData = await authService.getMe(req.user);
      return response({ res, code: 200, message: "Get me success", data: userData });
    } catch (error: any) {
      return response({ res, code: 401, message: error.message });
    }
  },
};

export default authController;
