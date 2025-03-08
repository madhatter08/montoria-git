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

const guideSchema = new mongoose.Schema({
  photo: { type: String },
  guideType: { type: String, enum: ["General", "Preschool", "Lower Elementary"] },
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  birthday: { type: Date, required: true },
  contactNumber: { type: String, required: true, trim: true },
  class: { type: String, ref: "class" },
}, { _id: false });

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true }
}, { _id: false });

const subworkSchema = new mongoose.Schema({
  subwork_name: { type: String, required: true },
  presented_date: { type: Date },
  practiced_date: { type: Date },
  mastered_date: { type: Date },
  remarks: { type: String },
  guide_name: { type: String },
  guide_school_id: { type: String },
}, { _id: false }); // Disable _id for subwork documents

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

const studentSchema = new mongoose.Schema({
  photo: { type: String },
  lrn: { type: String, trim: true },
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ["Male", "Female", "Others"], required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true, trim: true },
  //parent: parentSchema,
  parentName: { type: String, required: true },
  parentRel: { type: String, required: true, trim: true },
  parentPhone: { type: String, required: true },
  program: { type: String, ref: "program" },
  level: { type: String, ref: "level" },
  class: { type: String, ref: "class" },
  remarks: { type: String, trim: true },
  quarters: [quarterSchema],
  //lessons: [{ type: String }],
  // lessons: [{
  //   lesson_work: { type: String, }, 
  //   subwork: [subworkSchema], 
  // }],
  lessons: [{
    lesson_work: { type: String },
    addedBy: { type: String },
    remarks: { type: String },
    start_date: { type: Date },
    subwork: [{
      subwork_name: { type: String },
      status: { type: String, enum: ["presented", "practiced", "mastered"] },
      subwork_remarks: { type: String },
      status_date: { type: Date },
      updatedBy: { type: String }, 
    }],
  }],
}, { _id: false });

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




