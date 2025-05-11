import { Types } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
  nim: string;
  majors: string;
  years: string;
  status?: Status;
  research: string;
  telegram_id?: string;
  telegram_username?: string;
  device_id?: string;
  change_device_id?: string;
}

enum Role {
  Admin = 'admin',
  Lecturer = 'lecturer',
  MinisterOfResearch = 'minister of research',
  MinisterOfCompetition = 'minister of competition',
  MinisterOfBranding = 'minister of branding',
  MinisterOfOperation = 'minister of operation',
  President = 'president',
  MinisterOfResearchAndOperation = 'minister of research and operation',
  MinisterOfResearchAndCompetition = 'minister of research and competition',
  VicePresident = 'vice president',
  User = 'user',
}

enum Status {
  active = 'active',
  inactive = 'inactive',
  graduated = 'graduated',
}

export default IUser;
