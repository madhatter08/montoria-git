import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'class', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'excused', 'absent'], required: true }
}, { timestamps: true });

const attendanceModel = mongoose.models.attendance || mongoose.model('attendance', attendanceSchema)

export default attendanceModel;