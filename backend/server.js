// 1️⃣ Load env FIRST
import dotenv from "dotenv";
dotenv.config();

// 2️⃣ Imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 3️⃣ Route imports
import attendanceRoutes from "./routes/attendanceRoutes.js";

// 4️⃣ App init
const app = express();

// 5️⃣ Middleware
app.use(cors());
app.use(express.json());

// 6️⃣ Routes  ✅ ADD HERE
app.use("/api/attendance", attendanceRoutes);

// 7️⃣ Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// 8️⃣ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

// 9️⃣ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

