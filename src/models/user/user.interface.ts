import { Types } from "mongoose"; 

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Types.ObjectId; 
  nim: string;
  majors: string;
  years: string;
  status: string;
  research: string;
  telegram_id?: string;
  telegram_username?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;
