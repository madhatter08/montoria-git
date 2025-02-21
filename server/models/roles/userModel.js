import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
}, { _id: false });

const guideSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    contactNumber: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    class: [{ type: Number, ref: "class" }],
}, { _id: false });

const parentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true }
}, { _id: false });

const studentSchema = new mongoose.Schema({
    roleId: { type: Number, autoIncrement: true },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ["Male", "Female", "Others"], required: true },
    birthday: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    parent: [parentSchema],
    photo: { type: String, trim: true },
    allergy: { type: String, trim: true, default: "N/A"},
    levelId: { type: Number, ref: "level" },
    classId: { type: Number, ref: "class" },
    remarks: { type: String, trim: true },
  }, { _id: false });

const userSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  role: { type: String, enum: ["admin", "guide", "student"] },
  isActive: { type: Boolean, default: true },
  schoolId: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 8 },
  adminData: adminSchema,
  guideData: guideSchema,
  studentData: studentSchema,
  resetOtp: { type: String, default: "" },
  resetOtpExpiresAt: { type: Number, default: 0 },
  //verifyOtp: { type: String, default: "" },
  //verifyOtpExpiresAt: { type: Number, default: 0 },
  //isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel;