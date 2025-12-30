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

    // 1️⃣ Basic validation
    if (!employeeId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        error: "employeeId, lat and lng are required"
      });
    }

    // 2️⃣ Check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found"
      });
    }

    // 3️⃣ Prevent double punch-in
    const openAttendance = await Attendance.findOne({
      employeeId,
      status: "IN"
    });

    if (openAttendance) {
      return res.status(400).json({
        error: "Employee already punched in"
      });
    }

    // 4️⃣ Create attendance
    const attendance = await Attendance.create({
      employeeId,
      punchInTime: new Date(),
      location: { lat, lng },
      status: "IN"
    });

    res.status(201).json({
      message: "Punch In successful",
      attendance
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
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

    if (!employeeId) {
      return res.status(400).json({
        error: "employeeId is required"
      });
    }

    // 1️⃣ Find active punch-in
    const attendance = await Attendance.findOne({
      employeeId,
      status: "IN"
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        error: "No active punch-in found"
      });
    }

    // 2️⃣ Punch out
    attendance.punchOutTime = new Date();
    attendance.status = "OUT";
    await attendance.save();

    res.json({
      message: "Punch Out successful",
      attendance
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
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

    const records = await Attendance.find({ employeeId })
      .sort({ createdAt: -1 });

    res.json({
      employeeId,
      totalRecords: records.length,
      records
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
