// 1️⃣ Load env FIRST
import dotenv from "dotenv";
dotenv.config();

// 2️⃣ Imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 3️⃣ Route imports
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ auth added safely

// 4️⃣ App init
const app = express();

// 5️⃣ Middleware
app.use(cors());
app.use(express.json());

// 6️⃣ Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

// 7️⃣ Root test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// 8️⃣ Health check API (single, consolidated)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Attendance Backend",
    db: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 9️⃣ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

// 🔟 Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

