import mongoose from "mongoose";

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    photo: { type: String },
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Guide Schema
const guideSchema = new mongoose.Schema(
  {
    photo: { type: String },
    guideType: {
      type: String,
      enum: ["General", "Preschool", "Lower Elementary"],
    },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    contactNumber: { type: String, required: true, trim: true },
    class: { type: String, ref: "class" },
  },
  { _id: false }
);

// Parent Schema
const parentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Feedback Schema
const feedbackSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    feedback_text: { type: String, required: true },
    updatedBy: { type: String, required: true }, // Matches the schema
    email: { type: String, required: true }, // Matches the schema
    date: { type: Date, required: true },
  },
  { _id: false }
);

// Quarter Schema
const quarterSchema = new mongoose.Schema(
  {
    quarter: { type: Number, required: true }, // Quarter number (1, 2, 3, 4)
    feedback: [feedbackSchema], // Array of feedback for the quarter
  },
  { _id: false }
);

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    photo: { type: String },
    lrn: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ["Male", "Female", "Others"], required: true },
    birthday: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    parentName: { type: String, required: true },
    parentRel: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true },
    program: { type: String, ref: "program" },
    level: { type: String, ref: "level" },
    class: { type: String, ref: "class" },
    remarks: { type: String, trim: true },
    lessons: [{ type: String }],
    quarters: [quarterSchema], // Array of quarters with feedback
  },
  { _id: false }
);


// User Schema
const userSchema = new mongoose.Schema(
  {
    roleId: { type: Number, required: true },
    role: { type: String, enum: ["admin", "guide", "student"], required: true },
    isActive: { type: Boolean, default: true },
    schoolId: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8 },
    adminData: adminSchema,
    guideData: guideSchema,
    studentData: studentSchema,
    resetOtp: { type: String, default: "" },
    resetOtpExpiresAt: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create or retrieve the User model
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;