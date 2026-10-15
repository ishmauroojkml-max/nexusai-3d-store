import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartTotal, selectCartOpen, closeCart, removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);

  const tax = total * 0.08;
  const shipping = total > 100 ? 0 : 9.99;
  const grandTotal = total + tax + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] glass shadow-glass z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-display">Shopping Cart</h2>
                <span className="tag">{items.length} items</span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-white/50 text-lg">Your cart is empty</p>
                  <p className="text-white/30 text-sm mt-1">Add some awesome products!</p>
                  <Link to="/shop" onClick={() => dispatch(closeCart())}
                    className="btn-primary mt-6 text-sm">Browse Products</Link>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 glass rounded-xl p-3"
                    >
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-18 h-18 min-w-[72px] rounded-lg object-cover"
                        style={{ width: 72, height: 72 }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedColor && (
                            <span className="text-white/40 text-xs">Color: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span className="text-white/40 text-xs ml-2">Size: {item.selectedSize}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="neon-text font-semibold text-sm">{formatPrice(item.price)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))}
                              className="w-6 h-6 rounded-lg glass flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-white" />
                            </button>
                            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))}
                              className="w-6 h-6 rounded-lg glass flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                            <button
                              onClick={() => dispatch(removeFromCart(index))}
                              className="w-6 h-6 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors ml-1"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span><span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-base border-t border-white/10 pt-2">
                    <span>Total</span><span className="neon-text">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                {total < 100 && (
                  <p className="text-xs text-white/40 text-center">
                    Add {formatPrice(100 - total)} more for FREE shipping! 🚀
                  </p>
                )}
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-center"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  onClick={() => dispatch(closeCart())}
                  className="btn-secondary w-full text-center text-white/70 text-sm block py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
