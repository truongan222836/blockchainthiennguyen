const express = require('express');
const { User, Campaign, Donation } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Lấy thông tin profile người dùng
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Get user's campaigns
    const campaigns = await Campaign.findAll({
      where: { creatorId: req.user.id }
    });
    
    // Get user's donations
    const donations = await Donation.findAll({
      where: { donorId: req.user.id },
      include: [{
        model: Campaign,
        as: 'campaign',
        attributes: ['id', 'title', 'image']
      }]
    });

    const totalDonated = donations.reduce((sum, d) => {
      return sum + parseFloat(d.amount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          campaignsCount: campaigns.length,
          donationsCount: donations.length,
          totalDonated: totalDonated
        },
        campaigns,
        donations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Cập nhật profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, walletAddress, avatar } = req.body;

    const user = await User.findByPk(req.user.id);
    await user.update({ name, walletAddress, avatar });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật profile',
      error: error.message
    });
  }
});

module.exports = router;
