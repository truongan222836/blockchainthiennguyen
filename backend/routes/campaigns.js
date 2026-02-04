const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Campaign, User, Donation } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/campaigns
// @desc    Lấy danh sách chiến dịch (có tìm kiếm)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 12 } = req.query;

    const where = {};

    // Search
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      count: campaigns.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách chiến dịch',
      error: error.message
    });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Lấy chi tiết chiến dịch
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Donation,
          as: 'donations',
          include: [{
            model: User,
            as: 'donor',
            attributes: ['id', 'name', 'email']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chiến dịch'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết chiến dịch',
      error: error.message
    });
  }
});

// @route   POST /api/campaigns
// @desc    Tạo chiến dịch mới
// @access  Private
router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Vui lòng nhập tiêu đề'),
  body('description').trim().notEmpty().withMessage('Vui lòng nhập mô tả'),
  body('goalAmount').isFloat({ min: 0 }).withMessage('Số tiền mục tiêu không hợp lệ'),
  body('endDate').isISO8601().withMessage('Ngày kết thúc không hợp lệ')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      image,
      goalAmount,
      category,
      endDate,
      blockchainTxHash,
      contractAddress,
      onChainId
    } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      image: image || '',
      goalAmount: parseFloat(goalAmount),
      category: category || 'other',
      endDate,
      creatorId: req.user.id,
      blockchainTxHash: blockchainTxHash || '',
      contractAddress: contractAddress || '',
      onChainId: onChainId || null
    });

    const populatedCampaign = await Campaign.findByPk(campaign.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: populatedCampaign
    });
  } catch (error) {
    console.error("❌ CREATE CAMPAIGN ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo chiến dịch',
      error: error.message
    });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Cập nhật chiến dịch
// @access  Private (Creator only)
router.put('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chiến dịch'
      });
    }

    // Check if user is creator
    if (campaign.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật chiến dịch này'
      });
    }

    await campaign.update(req.body);

    const updatedCampaign = await Campaign.findByPk(campaign.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật chiến dịch',
      error: error.message
    });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Xóa chiến dịch
// @access  Private (Creator or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chiến dịch'
      });
    }

    // Check if user is creator or admin
    if (campaign.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa chiến dịch này'
      });
    }

    await campaign.destroy();

    res.json({
      success: true,
      message: 'Xóa chiến dịch thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa chiến dịch',
      error: error.message
    });
  }
});

module.exports = router;
