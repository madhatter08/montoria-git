import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    recipientRole: [{  type: String, enum: ["Parents", "Guides", "Admins", "Everyone"], required: true }],
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema)

export default notificationModel;