
import mongoose from "mongoose";
//import AutoIncrement from "mongoose-sequence";

const curriculumSchema = new mongoose.Schema({
  //curId: { type: String, unique: true, required: true },
  Program: { type: String, required: true },
  Level: { type: String, required: true },
  Areas: { type: String, required: true },
  Material: { type: String, required: true },
  Lesson: { type: String, required: true },
  Work: { type: String, required: true },
});

//curriculumSchema.plugin(AutoIncrement(mongoose), { inc_field: "curriculumId" });
const curriculumModel = mongoose.models.curriculum || mongoose.model('curriculum', curriculumSchema)

export default curriculumModel;