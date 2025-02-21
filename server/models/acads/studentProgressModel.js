import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "student", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "program", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "class", required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "lesson", required: true },
    work: { type: mongoose.Schema.Types.ObjectId, ref: "work", required: true },
    presented_date: { type: Date },
    practiced_date: { type: Date },
    mastered_date: { type: Date },
    completion_time: { type: Number, min: 0 },
    remarks: { type: String, trim: true },
}, { timestamps: true });

const studentProgressModel = mongoose.models.studentProgress || mongoose.model('studentProgress', studentProgressSchema)

export default studentProgressModel;