import { Response } from 'express';

interface ResponseParams {
  res: Response;
  code: number;
  message: string;
  data?: any;
}

const response = ({ res, code, message, data }: ResponseParams): Response => {
  return res.status(code).json({
    code,
    status: code < 400 ? 'success' : 'failed',
    message,
    data,
  });
};

export default response;
