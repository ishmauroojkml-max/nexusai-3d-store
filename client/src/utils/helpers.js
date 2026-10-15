export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getDiscountedPrice = (price, discount) => {
  return price * (1 - discount / 100);
};

export const generateStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => ({
    filled: i < Math.floor(rating),
    half: i === Math.floor(rating) && rating % 1 >= 0.5,
  }));
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    processing: 'text-purple-400 bg-purple-400/10',
    shipped: 'text-cyan-400 bg-cyan-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
};

export const DEMO_PRODUCTS = [
  {
    _id: 'demo1', name: 'NexusWatch Pro X1', category: 'smartwatch', brand: 'NexusTech',
    description: 'Ultimate fitness smartwatch with AMOLED display, GPS, heart rate monitor and 7-day battery life. Military-grade durability meets premium design.',
    price: 189, originalPrice: 249, stock: 50, sold: 120, isFeatured: true, isNew: false, discount: 24,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format'],
    colors: [{ name: 'Midnight Black', hex: '#1a1a1a' }, { name: 'Rose Gold', hex: '#b76e79' }, { name: 'Silver', hex: '#c0c0c0' }],
    tags: ['fitness', 'smartwatch', 'waterproof', 'gps'],
    features: ['GPS', 'Heart Rate', 'Sleep Tracking', 'Water Resistant', '7-Day Battery'],
    rating: 4.8, numReviews: 234,
  },
  {
    _id: 'demo2', name: 'AirZone Sneaker Pro', category: 'shoes', brand: 'NexusFit',
    description: 'Advanced running shoes with AirCushion technology, breathable mesh and responsive foam sole.',
    price: 149, originalPrice: 199, stock: 80, sold: 95, isFeatured: true, isNew: true, discount: 25,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format'],
    colors: [{ name: 'Electric Blue', hex: '#0066ff' }, { name: 'Neon Green', hex: '#39ff14' }, { name: 'Pure White', hex: '#ffffff' }],
    tags: ['fitness', 'running', 'sport'],
    features: ['AirCushion Sole', 'Breathable Mesh', 'Anti-Slip Grip', 'Lightweight'],
    rating: 4.6, numReviews: 189,
  },
  {
    _id: 'demo3', name: 'SoundPulse ANC Pro', category: 'headphones', brand: 'NexusAudio',
    description: 'Premium wireless headphones with 40-hour battery, adaptive noise cancellation and spatial audio.',
    price: 179, originalPrice: 299, stock: 35, sold: 210, isFeatured: true, isNew: false, discount: 40,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format'],
    colors: [{ name: 'Cosmic Black', hex: '#0d0d0d' }, { name: 'Pearl White', hex: '#f5f5f0' }],
    tags: ['wireless', 'noise-cancellation', 'bluetooth', 'premium'],
    features: ['40Hr Battery', 'Active Noise Cancellation', 'Spatial Audio', 'Fast Charge'],
    rating: 4.9, numReviews: 456,
  },
  {
    _id: 'demo4', name: 'FlexBand Elite', category: 'accessories', brand: 'NexusTech',
    description: 'Premium silicone fitness band with built-in heart rate monitor and SpO2 tracking.',
    price: 79, originalPrice: 99, stock: 120, sold: 340, isFeatured: false, isNew: true, discount: 20,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format'],
    colors: [{ name: 'Ocean Blue', hex: '#006994' }, { name: 'Coral Red', hex: '#ff6b6b' }, { name: 'Forest Green', hex: '#228b22' }],
    tags: ['fitness', 'smartwatch', 'budget'],
    features: ['Heart Rate', 'SpO2', 'Sleep Tracking', '10-Day Battery'],
    rating: 4.4, numReviews: 127,
  },
  {
    _id: 'demo5', name: 'UltraWatch Sport', category: 'smartwatch', brand: 'NexusTech',
    description: 'Military-grade durability smartwatch with built-in compass, altimeter and 14-day battery.',
    price: 249, originalPrice: 349, stock: 25, sold: 67, isFeatured: true, isNew: true, discount: 29,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format'],
    colors: [{ name: 'Desert Tan', hex: '#c19a6b' }, { name: 'Stealth Black', hex: '#2c2c2c' }],
    tags: ['fitness', 'outdoor', 'waterproof', 'premium', 'gps'],
    features: ['Military Grade', 'Compass', 'Altimeter', 'GPS', '14-Day Battery', '5ATM Water Resist'],
    rating: 4.7, numReviews: 89,
  },
  {
    _id: 'demo6', name: 'NexusBuds Air Pro', category: 'headphones', brand: 'NexusAudio',
    description: 'True wireless earbuds with 32-hour case battery, 6-hour playtime and IPX5 waterproof rating.',
    price: 99, originalPrice: 149, stock: 90, sold: 567, isFeatured: true, isNew: false, discount: 34,
    images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format'],
    colors: [{ name: 'Glacial White', hex: '#f8f8ff' }, { name: 'Midnight Blue', hex: '#003366' }],
    tags: ['wireless', 'bluetooth', 'waterproof', 'fitness'],
    features: ['6Hr Playtime', '32Hr Case', 'IPX5', 'Touch Controls', 'Voice Assistant'],
    rating: 4.6, numReviews: 789,
  },
  {
    _id: 'demo7', name: 'StreetBeat Kicks', category: 'shoes', brand: 'NexusFit',
    description: 'Stylish street sneakers combining urban aesthetics with premium comfort.',
    price: 119, originalPrice: 159, stock: 60, sold: 178, isFeatured: false, isNew: true, discount: 25,
    images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format'],
    colors: [{ name: 'Triple White', hex: '#ffffff' }, { name: 'Classic Black', hex: '#000000' }, { name: 'Crimson Red', hex: '#dc143c' }],
    tags: ['casual', 'sport', 'urban'],
    features: ['Memory Foam Insole', 'Vulcanized Sole', 'Premium Leather'],
    rating: 4.3, numReviews: 98,
  },
  {
    _id: 'demo8', name: 'NexusCharge Dock Pro', category: 'accessories', brand: 'NexusTech',
    description: 'Universal 5-in-1 wireless charging station with 65W fast charge for all your devices.',
    price: 59, originalPrice: 89, stock: 200, sold: 445, isFeatured: false, isNew: false, discount: 34,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format'],
    colors: [{ name: 'Space Grey', hex: '#717171' }, { name: 'Midnight Black', hex: '#1a1a1a' }],
    tags: ['wireless', 'charging', 'accessories'],
    features: ['65W Fast Charge', '5-in-1', 'Universal', 'LED Indicator'],
    rating: 4.5, numReviews: 312,
  },
];

