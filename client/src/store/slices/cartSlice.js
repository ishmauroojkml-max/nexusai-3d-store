import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('nexusai_cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveCartToStorage = (items) => {
  try { localStorage.setItem('nexusai_cart', JSON.stringify(items)); } catch {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { _id, selectedColor, selectedSize, ...rest } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item._id === _id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ _id, selectedColor, selectedSize, quantity: 1, ...rest });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartOpen = (state) => state.cart.isOpen;

export default cartSlice.reducer;

