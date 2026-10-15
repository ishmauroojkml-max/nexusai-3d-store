const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['smartwatch', 'shoes', 'accessories', 'headphones', 'laptop', 'phone'] },
  brand: { type: String, required: true },
  images: [{ type: String }],
  model3D: { type: String, default: '' },
  colors: [{ name: String, hex: String, textureUrl: String }],
  sizes: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [String],
  features: [String],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

