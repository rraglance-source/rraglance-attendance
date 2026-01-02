import express from "express";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const router = express.Router();

/**
 * ======================
 * PUNCH IN
 * ======================
 */
router.post("/punch-in", async (req, res) => {
  try {
    const { employeeId, lat, lng } = req.body;

    // 1️⃣ Validate input
    if (!employeeId || lat == null || lng == null) {
      return res.status(400).json({
        error: "employeeId, lat and lng are required",
      });
    }

    // 2️⃣ Check employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    // 3️⃣ Prevent double punch-in
    const existingPunchIn = await Attendance.findOne({
      employeeId,
      status: "IN",
    });

    if (existingPunchIn) {
      return res.status(400).json({
        error: "Employee already punched in",
      });
    }

    // 4️⃣ Create attendance
    const attendance = await Attendance.create({
      employeeId,
      punchInTime: new Date(),
      location: { lat, lng },
      status: "IN",
    });

    return res.status(201).json({
      message: "Punch In successful",
      attendance,
    });

  } catch (err) {
    console.error("Punch-in error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

/**
 * ======================
 * PUNCH OUT
 * ======================
 */
router.post("/punch-out", async (req, res) => {
  try {
    const { employeeId } = req.body;

    // 1️⃣ Validate input
    if (!employeeId) {
      return res.status(400).json({
        error: "employeeId is required",
      });
    }

    // 2️⃣ Find active punch-in
    const attendance = await Attendance.findOne({
      employeeId,
      status: "IN",
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        error: "No active punch-in found",
      });
    }

    // 3️⃣ Punch out + calculate working time
    const punchOutTime = new Date();

    const workedMs = punchOutTime - attendance.punchInTime;
    const workedMinutes = Math.floor(workedMs / (1000 * 60));
    const workedHours = Number((workedMinutes / 60).toFixed(2));

    attendance.punchOutTime = punchOutTime;
    attendance.workedMinutes = workedMinutes;
    attendance.workedHours = workedHours;
    attendance.status = "OUT";

    await attendance.save();

    return res.json({
      message: "Punch Out successful",
      attendance,
    });

  } catch (err) {
    console.error("Punch-out error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

/**
 * ======================
 * ATTENDANCE HISTORY
 * ======================
 */
router.get("/history/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        error: "employeeId is required",
      });
    }

    const records = await Attendance.find({ employeeId })
      .sort({ createdAt: -1 });

    return res.json({
      employeeId,
      totalRecords: records.length,
      records,
    });

  } catch (err) {
    console.error("History error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
