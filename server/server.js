import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectdb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import schoolRouter from "./routes/schoolRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();
const port = process.env.PORT || 4001; // Changed to 4001

const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("api working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/school", schoolRouter);
app.use("/api", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/attendance", attendanceRoutes);

const startServer = async () => {
  try {
    await connectdb();
    app.listen(port, () => {
      console.log(`Server listening on PORT: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to MongoDB connection error:", error);
    process.exit(1);
  }
};

startServer();