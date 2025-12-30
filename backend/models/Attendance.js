import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    punchInTime: {
      type: Date,
      required: true,
    },
    punchOutTime: {
      type: Date,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);

