const mongoose = require('mongoose');

const merchantRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
});

module.exports = mongoose.model('MerchantRequest', merchantRequestSchema);
