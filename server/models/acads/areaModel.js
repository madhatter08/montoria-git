import mongoose from 'mongoose';

// subjects per level e.g. Mathematics, Language for Junior Casa
const areaSchema = new mongoose.Schema({
    areaName: { type: String, required: true, },
    levelName: { type: String, ref: 'level', required: true }
}, { timestamps: true });

const areaModel = mongoose.models.area || mongoose.model('area', areaSchema)

export default areaModel;