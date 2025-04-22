import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;  
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    res.status(401).json({ message: "Access denied, token missing" });
  }

  try {
    const secret = process.env.JWT_SECRET || "defaultSecret";
    if (!token) {
      res.status(401).json({ message: "Access denied, token missing" });
    }
    const decoded = jwt.verify(token as string, secret);
    req.user = decoded;  
    next(); 
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
