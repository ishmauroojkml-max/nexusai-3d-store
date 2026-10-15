const Product = require('../models/Product');

// AI Product Recommendation Engine
const parseQuery = (query) => {
  const lower = query.toLowerCase();
  const result = { category: null, maxPrice: null, minPrice: null, features: [], keywords: [] };

  // Category detection
  if (lower.includes('watch') || lower.includes('smartwatch')) result.category = 'smartwatch';
  else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('footwear')) result.category = 'shoes';
  else if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('earbuds')) result.category = 'headphones';
  else if (lower.includes('laptop') || lower.includes('computer')) result.category = 'laptop';
  else if (lower.includes('phone') || lower.includes('mobile')) result.category = 'phone';
  else if (lower.includes('accessory') || lower.includes('accessories')) result.category = 'accessories';

  // Price detection
  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) result.maxPrice = Number(priceMatch[1]);
  const minMatch = lower.match(/above\s*\$?(\d+)|over\s*\$?(\d+)/);
  if (minMatch) result.minPrice = Number(minMatch[1] || minMatch[2]);
  const rangeMatch = lower.match(/\$?(\d+)\s*(?:to|-)\s*\$?(\d+)/);
  if (rangeMatch) { result.minPrice = Number(rangeMatch[1]); result.maxPrice = Number(rangeMatch[2]); }

  // Feature detection
  if (lower.includes('fitness') || lower.includes('workout') || lower.includes('sport')) result.features.push('fitness');
  if (lower.includes('gaming')) result.features.push('gaming');
  if (lower.includes('waterproof') || lower.includes('water resistant')) result.features.push('waterproof');
  if (lower.includes('wireless') || lower.includes('bluetooth')) result.features.push('wireless');
  if (lower.includes('noise cancel')) result.features.push('noise-cancellation');
  if (lower.includes('best') || lower.includes('top') || lower.includes('popular')) result.keywords.push('popular');
  if (lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable')) { if (!result.maxPrice) result.maxPrice = 100; }
  if (lower.includes('premium') || lower.includes('luxury') || lower.includes('high-end')) { if (!result.minPrice) result.minPrice = 200; }

  return result;
};

const generateResponse = (query, products, parsed) => {
  const greetings = ['Hi there! 👋', 'Hello! 😊', 'Hey! 🚀', 'Great question! 🎯'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  if (products.length === 0) {
    return `${greeting} I couldn't find products matching your criteria. Try broadening your search or browse our full catalog!`;
  }

  let response = `${greeting} `;
  if (parsed.category) response += `Here are some amazing **${parsed.category}s** `;
  else response += `Here are some great products `;
  if (parsed.maxPrice) response += `under **\$${parsed.maxPrice}** `;
  if (parsed.features.length) response += `perfect for **${parsed.features.join(', ')}** `;
  response += `I found for you! 🛍️`;
  return response;
};

// @desc   AI Chat recommendation
// @route  POST /api/ai/chat
exports.aiChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    const parsed = parseQuery(message);
    const productQuery = {};
    if (parsed.category) productQuery.category = parsed.category;
    if (parsed.maxPrice || parsed.minPrice) {
      productQuery.price = {};
      if (parsed.maxPrice) productQuery.price.$lte = parsed.maxPrice;
      if (parsed.minPrice) productQuery.price.$gte = parsed.minPrice;
    }
    if (parsed.features.length) {
      productQuery.tags = { $in: parsed.features };
    }

    let products = await Product.find(productQuery).limit(4).sort({ rating: -1 });
    
    // Fallback: if no results with tags, try without tag filter
    if (products.length === 0 && parsed.features.length) {
      delete productQuery.tags;
      products = await Product.find(productQuery).limit(4).sort({ rating: -1 });
    }

    // Final fallback: return featured products
    if (products.length === 0) {
      products = await Product.find({ isFeatured: true }).limit(4);
    }

    const aiResponse = generateResponse(message, products, parsed);

    // Quick replies based on context
    const quickReplies = [];
    if (parsed.category) {
      quickReplies.push(`Show all ${parsed.category}s`, `Best rated ${parsed.category}s`);
    } else {
      quickReplies.push('Show smartwatches under $200', 'Best fitness products', 'Show new arrivals');
    }

    res.json({
      success: true,
      response: aiResponse,
      products: products.map(p => ({
        _id: p._id, name: p.name, price: p.price, rating: p.rating,
        image: p.images[0], category: p.category, discount: p.discount,
      })),
      quickReplies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get AI suggestions based on browsing
// @route  GET /api/ai/suggestions/:productId
exports.getSuggestions = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4).sort({ rating: -1 });

    res.json({ success: true, products: similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

