import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

/**
 * ======================
 * LOGIN (EMPLOYEE)
 * ======================
 */
router.post("/login", async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "employeeId is required" });
    }

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json({
      message: "Login successful",
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
