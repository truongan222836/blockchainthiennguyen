const express = require('express');
const { body, validationResult } = require('express-validator');
const { Donation, Campaign, User } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   POST /api/donations
// @desc    Tạo quyên góp mới
// @access  Private
router.post('/', protect, [
  body('campaignId').notEmpty().withMessage('Vui lòng chọn chiến dịch'),
  body('amount').isFloat({ min: 0 }).withMessage('Số tiền không hợp lệ'),
  body('txHash').notEmpty().withMessage('Transaction hash là bắt buộc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { campaignId, amount, message, txHash, blockNumber } = req.body;

    // Check if campaign exists
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chiến dịch'
      });
    }

    // Check if transaction hash already exists
    const existingDonation = await Donation.findOne({ where: { txHash } });
    if (existingDonation) {
      return res.status(400).json({
        success: false,
        message: 'Transaction đã được xử lý'
      });
    }

    // Create donation
    const donation = await Donation.create({
      campaignId: parseInt(campaignId),
      donorId: req.user.id,
      amount: parseFloat(amount),
      message: message || '',
      txHash,
      blockNumber: blockNumber || null,
      status: 'confirmed'
    });

    // Update campaign
    const newAmount = parseFloat(campaign.currentAmount) + parseFloat(amount);
    await campaign.update({
      currentAmount: newAmount,
      status: newAmount >= parseFloat(campaign.goalAmount) ? 'completed' : campaign.status
    });

    const populatedDonation = await Donation.findByPk(donation.id, {
      include: [
        {
          model: Campaign,
          as: 'campaign',
          attributes: ['id', 'title']
        },
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: populatedDonation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo quyên góp',
      error: error.message
    });
  }
});

// @route   GET /api/donations
// @desc    Lấy danh sách quyên góp
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { campaignId, donorId, page = 1, limit = 20 } = req.query;
    
    const where = {};
    if (campaignId) where.campaignId = campaignId;
    if (donorId) where.donorId = donorId;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: donations } = await Donation.findAndCountAll({
      where,
      include: [
        {
          model: Campaign,
          as: 'campaign',
          attributes: ['id', 'title', 'image']
        },
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      count: donations.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách quyên góp',
      error: error.message
    });
  }
});

// @route   GET /api/donations/:id
// @desc    Lấy chi tiết quyên góp
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Campaign,
          as: 'campaign',
          attributes: ['id', 'title', 'description', 'image']
        },
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ]
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quyên góp'
      });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết quyên góp',
      error: error.message
    });
  }
});

module.exports = router;
