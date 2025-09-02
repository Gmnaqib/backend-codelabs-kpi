import express from "express";
import "dotenv/config";
const app = express();
const port = process.env.PORT;
import { connectDB } from "./config/db";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import attendanceRouter from "./routes/attendanceRoute";
import cors from "cors";

connectDB();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/attendance", attendanceRouter);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
