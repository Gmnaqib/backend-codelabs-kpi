interface IUser {
  name: string;
  email: string;
  dob?: string;
  address?: string;
  image?: string;
  password: string;
  role?: Role;
  nim: string;
  majors: string;
  years: string;
  status?: Status;
  research?: Research;
  telegram_id?: string;
  telegram_username?: string;
  device_id?: string;
  change_device_id?: boolean;
  product_id?: string;
}

export enum Role {
  Admin = "admin",
  Lecturer = "lecturer",
  MinisterOfResearch = "minister of research",
  MinisterOfCompetition = "minister of competition",
  MinisterOfBranding = "minister of branding",
  MinisterOfOperation = "minister of operation",
  President = "president",
  VicePresident = "vice president",
  Secretary = "secretary",
  User = "user",
}

export enum Status {
  active = "active",
  inactive = "inactive",
  graduated = "graduated",
}

export enum Research {
  website = "website",
  mobile = "mobile",
  game = "game",
  ui = "ui/ux",
  data = "data",
  other = "other",
}

export default IUser;
