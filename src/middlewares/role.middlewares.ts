import { Request, Response, NextFunction, RequestHandler } from "express";
import response from "../helper/response";
import jwt from "jsonwebtoken";
import "dotenv/config";

export interface AuthRequest extends Request {
  user?: any;
}

export const roleMiddlewares =
  (allowedRoles: string[]): RequestHandler =>
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    try {
      if (!secret) {
        response({ res, code: 500, message: "JWT_SECRET is not defined" });
        return;
      }

      if (!token) {
        response({ res, code: 401, message: "Token is undefined" });
        return;
      }

      const decoded = jwt.verify(token, secret) as any;
      req.user = decoded;

      if (!allowedRoles.includes(decoded.role)) {
        response({ res, code: 403, message: "Forbidden: insufficient role" });
        return;
      }

      next();
    } catch (error: any) {
      response({ res, code: 403, message: error.message });
      return;
    }
  };
