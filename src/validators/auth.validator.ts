import userRepository from "../repository/user.repository";
import { Research } from "../models/user/user.interface";

export const authValidate = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    nim: string;
    majors: string;
    years: string;
    research?: Research;
    telegram_id?: string;
    telegram_username?: string;
  }): Promise<void> => {
    const { name, email, password, nim, majors, years, research } = userData;

    if (!name || !email || !password || !nim || !majors || !years) {
      throw new Error("All fields are required");
    }

    // Validate name
    if (name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Validate NIM format (should be numeric)
    if (isNaN(Number(nim))) {
      throw new Error("Invalid nim format");
    }

    // Validate NIM length (assuming it should be a specific length)
    if (nim.length < 5) {
      throw new Error("NIM must be at least 5 characters long");
    }

    // Validate majors
    if (majors.trim().length === 0) {
      throw new Error("Majors cannot be empty");
    }

    // Validate years format (should be a valid year)
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(years);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 10) {
      throw new Error("Invalid year format");
    }

    // Validate research if provided
    if (research && !["frontend", "backend", "mobile", "uiux", "devops"].includes(research)) {
      throw new Error("Invalid research. Must be one of: frontend, backend, mobile, uiux, devops");
    }

    // Check if NIM already exists
    const existingUser = await userRepository.findUserByNim(nim);

    if (existingUser) {
      throw new Error("NIM Registered");
    }
  },

  login: async (nim: string, password: string): Promise<void> => {
    if (!nim || !password) {
      throw new Error("nim and password are required");
    }

    // Validate NIM format
    if (isNaN(Number(nim))) {
      throw new Error("Invalid nim format");
    }

    // Validate password
    if (password.trim().length === 0) {
      throw new Error("Password cannot be empty");
    }

    const user = await userRepository.findUserByNim(nim, true);

    if (!user) {
      throw new Error("Invalid credentials");
    }
  },

  createMultipleUsers: async (emails: string[]): Promise<void> => {
    if (!emails || emails.length === 0) {
      throw new Error("Email list is empty");
    }

    // Validate all emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }

      // Additional validation for email format that can be parsed
      const parts = email.split(".");
      if (parts.length < 2) {
        throw new Error(`Email format cannot be parsed: ${email}`);
      }

      const rest = parts[1];
      if (!rest.includes("@")) {
        throw new Error(`Email format cannot be parsed: ${email}`);
      }
    }
  },

  getMe: (user: any): void => {
    if (!user) {
      throw new Error("User not authenticated");
    }
  },
};

export default authValidate;
