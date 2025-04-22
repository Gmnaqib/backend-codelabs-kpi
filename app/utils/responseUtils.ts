import { Response } from "express";

interface ResponseData {
  code: number;
  status: string;
  message: string;
  data: any;
}

const response = (res: Response, statusCode: number, message: string, data: any): Response => {
  return res.status(statusCode).json({
    code: statusCode,
    status: statusCode < 400 ? 'success' : 'failed',
    message,
    data,
  });
};

export default response;
