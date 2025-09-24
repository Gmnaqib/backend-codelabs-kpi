import express from "express";
import "dotenv/config";
const app = express();
const port = process.env.PORT;
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import attendanceRouter from "./routes/attendance.route";
import settingRouter from "./routes/setting.route";
import scheduleRouter from "./routes/schedule.route";
import operationalRecordRouter from "./routes/operationalRecord.route";
import cors from "cors";

connectDB();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/attendance", attendanceRouter);
app.use("/setting", settingRouter);
app.use("/schedules", scheduleRouter);
app.use("/operational-records", operationalRecordRouter);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
