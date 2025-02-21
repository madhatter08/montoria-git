import mongoose from 'mongoose';

// lessons per subject e.g. counting numbers for Math
const lessonSchema = new mongoose.Schema({
    //lessonId: { type: Number, unique: true },
    lessonName: { type: String, required: true },
    areaName: { type: String, ref: 'area', required: true },
    //works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'work' }]
}, { timestamps: true });

const lessonModel = mongoose.models.lesson || mongoose.model('lesson', lessonSchema)

export default lessonModel;