const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  snapshotId: {
    type: String,
    required: true,
    unique: true
  },
  volumeId: {
    type: String,
    required: true
  },
  instanceId: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'error'],
    default: 'completed'
  },
  expirationDate: {
    type: Date,
    default: function() {
      const date = new Date(this.timestamp);
      date.setDate(date.getDate() + 30); // Default 30-day expiration
      return date;
    }
  }
});

// Indexes for faster queries
snapshotSchema.index({ instanceId: 1 });
snapshotSchema.index({ volumeId: 1 });
snapshotSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Snapshot', snapshotSchema);