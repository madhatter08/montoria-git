import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, trim: true },
    audience: [{ type: String, enum: ["Parents", "Guides", "Admins", "Everyone"], required: true }],
  }, { timestamps: true });

const eventModel = mongoose.models.event || mongoose.model('event', eventSchema)

export default eventModel;