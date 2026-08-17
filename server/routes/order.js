const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place a new order
// @access  Public
router.post('/', [
  body('customerName', 'Name is required').notEmpty(),
  body('phone', 'Phone number is required').notEmpty(),
  body('address', 'Delivery address is required').notEmpty(),
  body('items', 'Order must contain at least one item').isArray({ min: 1 }),
  body('items.*.name', 'Item name is required').notEmpty(),
  body('items.*.price', 'Item price must be a number').isNumeric(),
  body('items.*.quantity', 'Item quantity must be a positive integer').isInt({ min: 1 }),
  body('totalAmount', 'Total amount is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customerName, phone, address, items, totalAmount, orderNotes } = req.body;

  try {
    const newOrder = new Order({
      customerName,
      phone,
      address,
      items,
      totalAmount,
      orderNotes: orderNotes || '',
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // Broadcast real-time order via socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', savedOrder);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Server error placing order' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (with optional status/date filter)
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id/status', [
  auth,
  body('status', 'Valid status is required').isIn(['Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Notify client of status update
    const io = req.app.get('io');
    if (io) {
      io.emit('orderUpdated', updatedOrder);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete/Cancel an order
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
});

module.exports = router;
