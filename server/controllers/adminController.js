const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc   Get dashboard metrics (Admin)
// @route  GET /api/admin/metrics
exports.getDashboardMetrics = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalPrice createdAt orderStatus'),
    ]);

    const totalRevenue = orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthOrders = orders.filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate.getMonth() === date.getMonth() && oDate.getFullYear() === date.getFullYear() && o.isPaid;
      });
      monthlyRevenue.push({
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: monthOrders.reduce((s, o) => s + o.totalPrice, 0),
        orders: monthOrders.length,
      });
    }

    // Category breakdown
    const products = await Product.find().select('category sold');
    const categoryBreakdown = {};
    products.forEach(p => {
      categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + p.sold;
    });

    res.json({
      success: true,
      metrics: { totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders },
      monthlyRevenue,
      categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all users (Admin)
// @route  GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Seed demo data
// @route  POST /api/admin/seed
exports.seedData = async (req, res) => {
  try {
    const demoProducts = [
      {
        name: 'NexusWatch Pro X1', category: 'smartwatch', brand: 'NexusTech',
        description: 'Ultimate fitness smartwatch with AMOLED display, GPS, heart rate monitor and 7-day battery life.',
        price: 189, originalPrice: 249, stock: 50, sold: 120, isFeatured: true, isNew: false, discount: 24,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        colors: [{ name: 'Midnight Black', hex: '#1a1a1a' }, { name: 'Rose Gold', hex: '#b76e79' }, { name: 'Silver', hex: '#c0c0c0' }],
        tags: ['fitness', 'smartwatch', 'waterproof', 'gps'], features: ['GPS', 'Heart Rate', 'Sleep Tracking', 'Water Resistant', '7-Day Battery'],
        rating: 4.8, numReviews: 234,
      },
      {
        name: 'AirZone Sneaker Pro', category: 'shoes', brand: 'NexusFit',
        description: 'Advanced running shoes with AirCushion technology, breathable mesh and responsive foam sole.',
        price: 149, originalPrice: 199, stock: 80, sold: 95, isFeatured: true, isNew: true, discount: 25,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        colors: [{ name: 'Electric Blue', hex: '#0066ff' }, { name: 'Neon Green', hex: '#39ff14' }, { name: 'Pure White', hex: '#ffffff' }],
        tags: ['fitness', 'running', 'sport'], features: ['AirCushion Sole', 'Breathable Mesh', 'Anti-Slip Grip', 'Lightweight'],
        rating: 4.6, numReviews: 189,
      },
      {
        name: 'SoundPulse ANC Pro', category: 'headphones', brand: 'NexusAudio',
        description: 'Premium wireless headphones with 40-hour battery, adaptive noise cancellation and spatial audio.',
        price: 179, originalPrice: 299, stock: 35, sold: 210, isFeatured: true, isNew: false, discount: 40,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        colors: [{ name: 'Cosmic Black', hex: '#0d0d0d' }, { name: 'Pearl White', hex: '#f5f5f0' }],
        tags: ['wireless', 'noise-cancellation', 'bluetooth', 'premium'],
        features: ['40Hr Battery', 'Active Noise Cancellation', 'Spatial Audio', 'Fast Charge'],
        rating: 4.9, numReviews: 456,
      },
      {
        name: 'FlexBand Elite', category: 'accessories', brand: 'NexusTech',
        description: 'Premium silicone fitness band with built-in heart rate monitor and SpO2 tracking.',
        price: 79, originalPrice: 99, stock: 120, sold: 340, isFeatured: false, isNew: true, discount: 20,
        images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
        colors: [{ name: 'Ocean Blue', hex: '#006994' }, { name: 'Coral Red', hex: '#ff6b6b' }, { name: 'Forest Green', hex: '#228b22' }],
        tags: ['fitness', 'smartwatch', 'budget'], features: ['Heart Rate', 'SpO2', 'Sleep Tracking', '10-Day Battery'],
        rating: 4.4, numReviews: 127,
      },
      {
        name: 'UltraWatch Sport', category: 'smartwatch', brand: 'NexusTech',
        description: 'Military-grade durability smartwatch with built-in compass, altimeter and 14-day battery.',
        price: 249, originalPrice: 349, stock: 25, sold: 67, isFeatured: true, isNew: true, discount: 29,
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
        colors: [{ name: 'Desert Tan', hex: '#c19a6b' }, { name: 'Stealth Black', hex: '#2c2c2c' }],
        tags: ['fitness', 'outdoor', 'waterproof', 'premium', 'gps'],
        features: ['Military Grade', 'Compass', 'Altimeter', 'GPS', '14-Day Battery', '5ATM Water Resist'],
        rating: 4.7, numReviews: 89,
      },
      {
        name: 'NexusCharge Dock Pro', category: 'accessories', brand: 'NexusTech',
        description: 'Universal 5-in-1 wireless charging station with 65W fast charge for all your devices.',
        price: 59, originalPrice: 89, stock: 200, sold: 445, isFeatured: false, isNew: false, discount: 34,
        images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
        colors: [{ name: 'Space Grey', hex: '#717171' }, { name: 'Midnight Black', hex: '#1a1a1a' }],
        tags: ['wireless', 'charging', 'accessories'], features: ['65W Fast Charge', '5-in-1', 'Universal', 'LED Indicator'],
        rating: 4.5, numReviews: 312,
      },
      {
        name: 'StreetBeat Kicks', category: 'shoes', brand: 'NexusFit',
        description: 'Stylish street sneakers combining urban aesthetics with premium comfort.',
        price: 119, originalPrice: 159, stock: 60, sold: 178, isFeatured: false, isNew: true, discount: 25,
        images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500'],
        colors: [{ name: 'Triple White', hex: '#ffffff' }, { name: 'Classic Black', hex: '#000000' }, { name: 'Crimson Red', hex: '#dc143c' }],
        tags: ['casual', 'sport', 'urban'], features: ['Memory Foam Insole', 'Vulcanized Sole', 'Premium Leather'],
        rating: 4.3, numReviews: 98,
      },
      {
        name: 'NexusBuds Air Pro', category: 'headphones', brand: 'NexusAudio',
        description: 'True wireless earbuds with 32-hour case battery, 6-hour playtime and IPX5 waterproof rating.',
        price: 99, originalPrice: 149, stock: 90, sold: 567, isFeatured: true, isNew: false, discount: 34,
        images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'],
        colors: [{ name: 'Glacial White', hex: '#f8f8ff' }, { name: 'Midnight Blue', hex: '#003366' }],
        tags: ['wireless', 'bluetooth', 'waterproof', 'fitness'], features: ['6Hr Playtime', '32Hr Case', 'IPX5', 'Touch Controls', 'Voice Assistant'],
        rating: 4.6, numReviews: 789,
      },
    ];

    await Product.deleteMany({});
    await Product.insertMany(demoProducts);
    
    res.json({ success: true, message: `✅ Seeded ${demoProducts.length} demo products successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

