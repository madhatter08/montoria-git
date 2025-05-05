const mongoose = require('mongoose');

const SchoolYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true }, // e.g., "2024-2025"
  isActive: { type: Boolean, default: true },
  quarters: [
    {
      quarterId: { type: String, required: true }, // e.g., "Q1"
      name: { type: String, required: true }, // e.g., "First Quarter"
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      isActive: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SchoolYear', SchoolYearSchema);