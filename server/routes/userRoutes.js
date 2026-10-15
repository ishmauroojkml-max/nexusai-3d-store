const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Cart routes (stored in user session / client-side Redux, these are for persistence)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ success: true, user });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, avatar }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const inWishlist = user.wishlist.includes(req.params.productId);
    if (inWishlist) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    } else {
      user.wishlist.push(req.params.productId);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, added: !inWishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

