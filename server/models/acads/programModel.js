import mongoose from 'mongoose';
// import AutoIncrement from "mongoose-sequence";

// Programs: Toddler, Preschool/Casa, Lower Elementary
const programSchema = new mongoose.Schema({
    //progId: { type: Number, unique: true },
    progName: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

// programSchema.plugin(AutoIncrement(mongoose), { inc_field: "progId" });
const programModel = mongoose.models.program || mongoose.model('program', programSchema)

export default programModel;