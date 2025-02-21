import mongoose from 'mongoose';

// Level Schema
/* 
  Toddler
  Preschool/Casa: Junior Casa, Junior Advanced Casa, Advanced Casa
  Lower Elementary: Grade 1, Grade 2, Grade 3
*/
const levelSchema = new mongoose.Schema({
    levelName: { type: String, required: true, trim: true },
    progName: { type: String, ref: "program" }
}, { timestamps: true });

//levelSchema.index({ levelName: 1, progName: 1 }, { unique: true });

const levelModel = mongoose.models.level || mongoose.model('level', levelSchema)

export default levelModel;