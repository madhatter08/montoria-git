import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true }
}, { _id: false });

const studentSchema = new mongoose.Schema({
    //schoolId: { type: String, required: true, unique: true, trim: true },
    //user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
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
    level: { type: mongoose.Schema.Types.ObjectId, ref: "level" },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "class" },
    schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "schedule" }],
    remarks: { type: String, trim: true },
  }, { timestamps: true });

const studentModel = mongoose.models.student || mongoose.model('student', studentSchema)

export default studentModel;