import mongoose from 'mongoose';

// works per lesson e.g. counting 1-10 for counting numbers
const workSchema = new mongoose.Schema({
    //workId: { type: Number, unique: true},
    workName: { type: String, required: true },
    lessonName: { type: Number, ref: 'lesson', required: true },
    materialName: [{ type: Number, ref: 'material' }]
}, { timestamps: true });

const workModel = mongoose.models.work || mongoose.model('work', workSchema)

export default workModel;