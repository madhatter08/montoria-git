import mongoose from "mongoose";
//import AutoIncrement from "mongoose-sequence";

const curriculumSchema = new mongoose.Schema({
  curId: { type: String, unique: true, required: true },
  progName: { type: String, ref: "program", required: true },
  levelName: { type: String, ref: "level", required: true },
  areaName: { type: String, ref: "area", required: true },
  lessonName: { type: String, required: true },
  workName: [{ type: String, required: true }],
  materialName: [{ type: String }],
  photo: { type: String },
}, { timestamps: true });

//curriculumSchema.plugin(AutoIncrement(mongoose), { inc_field: "curriculumId" });
const curriculumModel = mongoose.models.curriculum || mongoose.model('curriculum', curriculumSchema)

export default curriculumModel;