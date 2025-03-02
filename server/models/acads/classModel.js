import mongoose from 'mongoose';

// Class Schema - each class consists of students from different levels
/* 
  Toddler
  Preschool/Casa: Casa 1, Casa 2
  Lower Elementary: Class 1, Class 2
*/

const scheduleSchema = new mongoose.Schema({
    days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
}, { _id: false });

const classSchema = new mongoose.Schema({
    program: { type: String, ref: "program" },
    class: { type: String, required: true, trim: true },
    guides: [{ type: String, ref: "user" }],
    capacity: { type: Number, required: true, min: 0 },
    students: [{ type: String, ref: "user" }],
    schedule: scheduleSchema,
  },
  { timestamps: true }
);

const classModel = mongoose.models.class || mongoose.model('class', classSchema)

export default classModel;