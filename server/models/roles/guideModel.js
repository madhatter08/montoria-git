import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
    //role: { type: String, default: "Guide" },
    //user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    roleId: { type: Number, autoIncrement: true },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
    contactNumber: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    class: [{ type: mongoose.Schema.Types.ObjectId, ref: "class" }],
}, { timestamps: true });

const guideModel = mongoose.models.guide || mongoose.model('guide', guideSchema)

export default guideModel;