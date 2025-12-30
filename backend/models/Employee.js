import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      default: "employee",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);

