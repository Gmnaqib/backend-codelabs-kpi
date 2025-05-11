import { Request, Response } from 'express';
import User from '../models/user/user.schema';
import response from '../helper/response';
import userRepository from '../repository/userRepository';

const userController = {
  getAllUsers: async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await userRepository.findAll();
      return response({ res, code: 200, message: 'Get all user success', data: users });
    } catch (error) {
      return response({ res, code: 500, message: 'Error fetching users' });
    }
  },

  getUserById: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: 'User not found' });
      }
      return response({ res, code: 200, message: 'User fetched successfully', data: user });
    } catch (error) {
      return response({ res, code: 500, message: 'Error fetching user' });
    }
  },

  updateUser: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const { name, email, password, role, nim, majors, years, status, research } = req.body;
      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      user.nim = nim || user.nim;
      user.majors = majors || user.majors;
      user.years = years || user.years;
      user.status = status || user.status;
      user.research = research || user.research;
      await user.save();

      return response({ res, code: 200, message: 'User updated successfully', data: user });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return response({ res, code: 404, message: 'User not found' });
      }
      return response({ res, code: 200, message: 'User deleted successfully', data: user });
    } catch (error) {
      return response({ res, code: 500, message: 'Error deleting user' });
    }
  },

  updateUserRole: async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, role } = req.body;
      if (!userId || !role) {
        return response({ res, code: 400, message: 'User ID and roleName are required' });
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        return response({ res, code: 404, message: 'User not found' });
      }
      user.role = role;
      await user.save();

      return response({ res, code: 200, message: 'User role updated successfully', data: user });
    } catch (error) {
      return response({ res, code: 500, message: 'Error updating user role' });
    }
  },
};

export default userController;
