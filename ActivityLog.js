const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['transport', 'food', 'energy'],
      required: true,
    },
    icon: {
      type: String,
      default: '🌱',
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true, // e.g. 'km', 'kg', 'kWh', 'meal'
    },
    co2Grams: {
      type: Number,
      required: true, // stored in grams for precision
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
