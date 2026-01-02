import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // 🔑 Employee identifier (HR / business ID)
    employeeId: {
      type: String,
      required: true,
      index: true,
    },

    // ⏱ Time tracking
    punchInTime: {
      type: Date,
      required: true,
    },

    punchOutTime: {
      type: Date,
      default: null,
    },

    // 📍 Location capture
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    // 🔄 Status
    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
      index: true,
    },

    // 🧮 Work calculation (STEP 2)
    workedMinutes: {
      type: Number,
      default: 0,
    },

    workedHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Attendance", attendanceSchema);
