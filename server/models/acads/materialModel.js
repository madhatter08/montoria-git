import mongoose from 'mongoose';

// materials used for each work
const materialSchema = new mongoose.Schema({
    //materialId: { type: Number, unique: true },
    materialName: { type: String, required: true },
    photo: { type: String },
    workName: [{ type: String, ref: 'work' }],
}, { timestamps: true });

const materialModel = mongoose.models.material || mongoose.model('material', materialSchema)

export default materialModel;