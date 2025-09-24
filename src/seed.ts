import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import "dotenv/config";

// Import all models
import User from "./models/user/user.schema";
import Attendance from "./models/attendance/attendance.schema";
import LeaveRequest from "./models/attendance/leave.request.schema";
import Setting from "./models/setting/setting.schema";

// Import interfaces and enums
import { Role, Status } from "./models/user/user.interface";
import { attendanceStatus } from "./models/attendance/attendance.Interface";
import { attendanceType, approvalStatus } from "./models/attendance/leave.request.interface";

// Database connection
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/codelabs-kpi";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Clear all existing data
async function clearData() {
  console.log("🗑️ Clearing existing data...");

  await Attendance.deleteMany({});
  await LeaveRequest.deleteMany({});
  await User.deleteMany({});
  await Setting.deleteMany({});

  console.log("✅ All collections cleared");
}

// Generate realistic Indonesian university data
function generateNIM(): string {
  // Format: 3 digit major code + 2 digit year + 3 digit student number
  const majors = ["101", "111", "121"]; // Informatika, Sistem Informasi, DKV
  const years = ["20", "21", "22", "23", "24"]; // 2020-2024
  const studentNum = faker.string.numeric(3);

  return faker.helpers.arrayElement(majors) + faker.helpers.arrayElement(years) + studentNum;
}

function getMajorFromNIM(nim: string): string {
  const majorCode = nim.substring(0, 3);
  switch (majorCode) {
    case "101":
      return "Informatika";
    case "111":
      return "Sistem Informasi";
    case "121":
      return "Desain Komunikasi Visual";
    default:
      return "Informatika";
  }
}

function getYearFromNIM(nim: string): string {
  return "20" + nim.substring(3, 5);
}

function generateIndonesianEmail(name: string, nim: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  return `${cleanName}.${nim}@email.unikom.ac.id`;
}

// Seed Users
async function seedUsers() {
  console.log("👥 Seeding users...");

  const users = [];
  const usedNIMs = new Set<string>();
  const usedEmails = new Set<string>();
  const researchAreas = ["website", "mobile", "game", "ui/ux", "data", "IoT", "other"];

  // Create admin users (Note: Secretary not included in schema enum)
  const adminRoles = [Role.Admin, Role.President, Role.VicePresident];

  for (const role of adminRoles) {
    let nim, email;
    do {
      nim = generateNIM();
    } while (usedNIMs.has(nim));

    const name = faker.person.fullName();
    do {
      email = generateIndonesianEmail(name, nim);
    } while (usedEmails.has(email));

    usedNIMs.add(nim);
    usedEmails.add(email);

    users.push({
      name,
      email,
      password: await bcrypt.hash("password123", 10),
      nim,
      majors: getMajorFromNIM(nim),
      years: getYearFromNIM(nim),
      role,
      status: Status.active,
      research: faker.helpers.arrayElement(researchAreas),
      telegram_id: faker.string.numeric(9),
      telegram_username: "@" + faker.internet.username(),
      device_id: faker.string.uuid(),
      change_device_id: faker.datatype.boolean(),
    });
  }

  // Create minister users
  const ministerRoles = [
    Role.MinisterOfResearch,
    Role.MinisterOfCompetition,
    Role.MinisterOfBranding,
    Role.MinisterOfOperation,
    Role.MinisterOfResearchAndOperation,
    Role.MinisterOfResearchAndCompetition,
  ];

  for (const role of ministerRoles) {
    let nim, email;
    do {
      nim = generateNIM();
    } while (usedNIMs.has(nim));

    const name = faker.person.fullName();
    do {
      email = generateIndonesianEmail(name, nim);
    } while (usedEmails.has(email));

    usedNIMs.add(nim);
    usedEmails.add(email);

    users.push({
      name,
      email,
      password: await bcrypt.hash("password123", 10),
      nim,
      majors: getMajorFromNIM(nim),
      years: getYearFromNIM(nim),
      role,
      status: Status.active,
      research: faker.helpers.arrayElement(researchAreas),
      telegram_id: faker.string.numeric(9),
      telegram_username: "@" + faker.internet.username(),
      device_id: faker.string.uuid(),
      change_device_id: faker.datatype.boolean(),
    });
  }

  // Create lecturers
  for (let i = 0; i < 5; i++) {
    let nim, email;
    do {
      nim = generateNIM();
    } while (usedNIMs.has(nim));

    const name = "Dr. " + faker.person.fullName();
    do {
      email = generateIndonesianEmail(name, nim);
    } while (usedEmails.has(email));

    usedNIMs.add(nim);
    usedEmails.add(email);

    users.push({
      name,
      email,
      password: await bcrypt.hash("password123", 10),
      nim,
      majors: getMajorFromNIM(nim),
      years: getYearFromNIM(nim),
      role: Role.Lecturer,
      status: Status.active,
      research: faker.helpers.arrayElement(researchAreas),
      telegram_id: faker.string.numeric(9),
      telegram_username: "@" + faker.internet.username(),
      device_id: faker.string.uuid(),
      change_device_id: faker.datatype.boolean(),
    });
  }

  // Create regular users (students)
  for (let i = 0; i < 50; i++) {
    let nim, email;
    do {
      nim = generateNIM();
    } while (usedNIMs.has(nim));

    const name = faker.person.fullName();
    do {
      email = generateIndonesianEmail(name, nim);
    } while (usedEmails.has(email));

    usedNIMs.add(nim);
    usedEmails.add(email);

    users.push({
      name,
      email,
      password: await bcrypt.hash("password123", 10),
      nim,
      majors: getMajorFromNIM(nim),
      years: getYearFromNIM(nim),
      role: Role.User,
      status: faker.helpers.arrayElement(Object.values(Status)),
      research: faker.helpers.arrayElement(researchAreas),
      telegram_id: faker.datatype.boolean() ? faker.string.numeric(9) : undefined,
      telegram_username: faker.datatype.boolean() ? "@" + faker.internet.username() : undefined,
      device_id: faker.datatype.boolean() ? faker.string.uuid() : undefined,
      change_device_id: faker.datatype.boolean(),
    });
  }

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);

  return createdUsers;
}

// Seed Settings
async function seedSettings() {
  console.log("⚙️ Seeding settings...");

  const settings = [
    {
      code: "RAMADHAN",
      name: "Ramadhan Schedule",
      value: faker.datatype.boolean(),
    },
    {
      code: "SEMESTER_HOLIDAY",
      name: "Semester Holiday",
      value: faker.datatype.boolean(),
    },
    {
      code: "REGISTRATION_OPEN",
      name: "Registration Open",
      value: true,
    },
    {
      code: "MAINTENANCE_MODE",
      name: "Maintenance Mode",
      value: false,
    },
    {
      code: "COMPETITION_SEASON",
      name: "Competition Season",
      value: faker.datatype.boolean(),
    },
  ];

  const createdSettings = await Setting.insertMany(settings);
  console.log(`✅ Created ${createdSettings.length} settings`);

  return createdSettings;
}

// Seed Leave Requests
async function seedLeaveRequests(users: any[]) {
  console.log("📝 Seeding leave requests...");

  const leaveRequests = [];
  const activeUsers = users.filter((user) => user.status === Status.active);

  // Create leave requests for random users
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(activeUsers);
    const startDate = faker.date.between({
      from: DateTime.now().minus({ months: 2 }).toJSDate(),
      to: DateTime.now().plus({ months: 1 }).toJSDate(),
    });

    const endDate = faker.date.between({
      from: startDate,
      to: DateTime.fromJSDate(startDate)
        .plus({ days: faker.number.int({ min: 1, max: 7 }) })
        .toJSDate(),
    });

    const type = faker.helpers.arrayElement(["sick", "leave"] as attendanceType[]);
    const reasons = {
      sick: ["Demam tinggi dan flu berat", "Sakit kepala migrain", "Diare dan mual", "Batuk dan pilek", "Sakit gigi"],
      leave: ["Keperluan keluarga mendesak", "Menghadiri pernikahan saudara", "Urusan administrasi kampus", "Acara keluarga penting", "Keperluan dokumen penting"],
    };

    const approvalStatuses = Object.values(approvalStatus);
    const currentStatus = faker.helpers.arrayElement(approvalStatuses);

    // Get random admin/lecturer for approver if approved/rejected
    const approvers = users.filter((u) => u.role === Role.Admin || u.role === Role.Lecturer || u.role === Role.President || u.role === Role.VicePresident);

    leaveRequests.push({
      userId: user._id,
      type,
      reason: faker.helpers.arrayElement(reasons[type]),
      attachmentUrl: `https://drive.google.com/file/d/${faker.string.alphanumeric(28)}/view`,
      startDate,
      endDate,
      approvalStatus: currentStatus,
      approvedBy: currentStatus !== approvalStatus.PENDING ? faker.helpers.arrayElement(approvers)._id : null,
    });
  }

  const createdLeaveRequests = await LeaveRequest.insertMany(leaveRequests);
  console.log(`✅ Created ${createdLeaveRequests.length} leave requests`);

  return createdLeaveRequests;
}

// Seed Attendance
async function seedAttendance(users: any[], leaveRequests: any[]) {
  console.log("📅 Seeding attendance...");

  const attendanceRecords = [];
  const activeUsers = users.filter((user) => user.status === Status.active);

  // Generate attendance for the last 30 days
  const startDate = DateTime.now().minus({ days: 30 });

  for (let day = 0; day < 30; day++) {
    const currentDate = startDate.plus({ days: day });

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.weekday === 6 || currentDate.weekday === 7) {
      continue;
    }

    // Generate attendance for random subset of users each day
    const dailyAttendees = faker.helpers.arrayElements(activeUsers, faker.number.int({ min: Math.floor(activeUsers.length * 0.6), max: activeUsers.length }));

    for (const user of dailyAttendees) {
      const attendanceChance = faker.number.float({ min: 0, max: 1 });

      // 85% chance of normal attendance
      if (attendanceChance < 0.85) {
        const baseCheckIn = currentDate.set({
          hour: faker.number.int({ min: 7, max: 9 }),
          minute: faker.number.int({ min: 0, max: 59 }),
        });

        const checkOutHour = faker.number.int({ min: 17, max: 20 });
        const baseCheckOut = currentDate.set({
          hour: checkOutHour,
          minute: faker.number.int({ min: 0, max: 59 }),
        });

        // Check if user has approved leave for this date
        const hasLeave = leaveRequests.some(
          (lr) => lr.userId.equals(user._id) && lr.approvalStatus === approvalStatus.APPROVED && currentDate.toJSDate() >= lr.startDate && currentDate.toJSDate() <= lr.endDate
        );

        if (hasLeave) {
          const leaveRequest = leaveRequests.find(
            (lr) => lr.userId.equals(user._id) && lr.approvalStatus === approvalStatus.APPROVED && currentDate.toJSDate() >= lr.startDate && currentDate.toJSDate() <= lr.endDate
          );

          attendanceRecords.push({
            userId: user._id,
            date: currentDate.toJSDate(),
            status: leaveRequest.type === "sick" ? attendanceStatus.SICK : attendanceStatus.LEAVE,
            leaveRequestId: leaveRequest._id,
          });
        } else {
          // Normal attendance
          const isLate = baseCheckIn.hour >= 9;

          attendanceRecords.push({
            userId: user._id,
            date: currentDate.toJSDate(),
            status: attendanceStatus.PRESENT,
            checkIn: baseCheckIn.toJSDate(),
            checkOut: baseCheckOut.toJSDate(),
            reason: isLate ? faker.helpers.arrayElement(["Terjebak macet di jalan", "Kendaraan mogok", "Bangun kesiangan", "Hujan deras", "Transportasi terlambat"]) : undefined,
          });
        }
      } else {
        // 15% chance of absence (no record means absent)
        // Only create record if it's marked absent
        if (faker.number.float({ min: 0, max: 1 }) < 0.3) {
          attendanceRecords.push({
            userId: user._id,
            date: currentDate.toJSDate(),
            status: attendanceStatus.ABSENT,
          });
        }
      }
    }
  }

  const createdAttendance = await Attendance.insertMany(attendanceRecords);
  console.log(`✅ Created ${createdAttendance.length} attendance records`);

  return createdAttendance;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    console.log("=====================================");

    await connectDB();
    await clearData();

    // Seed in order due to dependencies
    const users = await seedUsers();
    const settings = await seedSettings();
    const leaveRequests = await seedLeaveRequests(users);
    const attendance = await seedAttendance(users, leaveRequests);

    console.log("=====================================");
    console.log("🎉 Database seeding completed successfully!");
    console.log(`
📊 Summary:
   👥 Users: ${users.length}
   ⚙️ Settings: ${settings.length}
   📝 Leave Requests: ${leaveRequests.length}
   📅 Attendance Records: ${attendance.length}

🔑 Default password for all users: password123

👑 Admin users created with roles:
   - Admin
   - President  
   - Vice President
   - Ministers (Research, Competition, Branding, Operation)

🎯 You can now test your API with realistic data!
    `);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📊 Database connection closed");
    process.exit(0);
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
