import { Request, Response, NextFunction } from 'express';
import response from '../helper/response';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export interface AuthRequest extends Request {
  user?: any;
}

export const roleMiddlewares = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  try {
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (!token) {
      throw new Error('Token is undefined');
    }
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    if (decoded.role == 'user') {
      return response({ res, code: 403, message: 'forbidden', data: null });
    }
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
