const MerchantRequest = require('../models/merchantRequest');

// Create a new merchant request
exports.createMerchantRequest = async (req, res) => {
    console.log(req.body)
    const merchantRequest = await MerchantRequest.create(req.body)

    res.status(201).json({
        success: true,
        merchantRequest
    })
};

// Get all merchant requests
exports.getAllMerchantRequests = async (req, res) => {
  try {
    const merchantRequests = await MerchantRequest.find().populate('userId', 'name email');

    res.status(200).json({ merchantRequests });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the merchant requests' });
  }
};

// Update the status of a merchant request
exports.updateMerchantRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const merchantRequest = await MerchantRequest.findByIdAndUpdate(requestId, { status }, { new: true });

    if (!merchantRequest) {
      return res.status(404).json({ error: 'Merchant request not found' });
    }

    res.status(200).json({ message: 'Merchant request updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the merchant request status' });
  }
};
