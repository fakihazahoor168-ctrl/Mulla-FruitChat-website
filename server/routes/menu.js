const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({
      $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }]
    }).sort({ category: 1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
});

// @route   GET /api/menu/all
// @desc    Get all menu items including unavailable (admin)
// @access  Private (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ category: 1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching all menu items:', error);
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item
// @access  Private (Admin only)
router.post('/', [
  auth,
  body('nameEnglish', 'English name is required').notEmpty(),
  body('nameUrdu', 'Urdu name is required').notEmpty(),
  body('category', 'Category is required').notEmpty(),
  body('price').custom((value, { req }) => {
    if (!req.body.sizes || Object.keys(req.body.sizes).length === 0) {
      if (value === undefined || value === null || isNaN(value)) {
        throw new Error('Price is required for single size items');
      }
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nameEnglish, nameUrdu, category, price, sizes, image, isAvailable, isSpecial } = req.body;

  try {
    const newItem = new MenuItem({
      nameEnglish,
      nameUrdu,
      category,
      price: price || null,
      sizes: sizes || {},
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isSpecial: isSpecial !== undefined ? isSpecial : false
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error creating menu item' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update an existing menu item
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  body('nameEnglish', 'English name is required').notEmpty(),
  body('nameUrdu', 'Urdu name is required').notEmpty(),
  body('category', 'Category is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nameEnglish, nameUrdu, category, price, sizes, image, isAvailable, isSpecial } = req.body;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        nameEnglish,
        nameUrdu,
        category,
        price: price || null,
        sizes: sizes || {},
        image: image || '',
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        isSpecial: isSpecial !== undefined ? isSpecial : false
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error updating menu item' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error deleting menu item' });
  }
});

// @route   POST /api/menu/:id/review
// @desc    Add a review to a menu item
// @access  Public
router.post('/:id/review', [
  body('userName', 'Name is required').notEmpty(),
  body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, rating, comment } = req.body;

  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const newReview = {
      userName,
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    item.reviews.push(newReview);
    item.numReviews = item.reviews.length;
    item.rating = Number((item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length).toFixed(1));

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

module.exports = router;
