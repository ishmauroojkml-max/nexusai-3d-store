import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      selectedColor: product.colors?.[0]?.name,
      quantity: 1,
    }));
    dispatch(openCart());
    toast.success(`${product.name} added! 🛒`, { duration: 2000 });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    toast(liked ? '💔 Removed from wishlist' : '❤️ Added to wishlist', { duration: 1500 });
  };

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="product-card group">
          {/* Image */}
          <div className="relative overflow-hidden bg-white/5 aspect-square">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <img
              src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && <span className="badge-new">NEW</span>}
              {product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-xl glass opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                liked ? 'bg-red-500/20' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'text-red-400 fill-red-400' : 'text-white/70'}`} />
            </button>

            {/* Quick actions */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
              <Link
                to={`/product/${product._id}`}
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-xl glass text-white hover:glow-blue transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">{product.category}</p>
                <h3 className="text-white font-semibold text-sm mt-0.5 group-hover:neon-text transition-all line-clamp-1">{product.name}</h3>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white/60 text-xs">{product.rating?.toFixed(1)}</span>
              </div>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1.5 mb-3">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-white/20 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-white/30 text-xs self-center">+{product.colors.length - 4}</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="neon-text font-bold text-base">{formatPrice(discountedPrice)}</span>
              {product.discount > 0 && (
                <span className="text-white/30 text-sm line-through">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
