import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  //role: { type: String, default: "Admin" },
  //user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  roleId: { type: Number, ref: "user" },
  schoolId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 8 },
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema)

export default adminModel;