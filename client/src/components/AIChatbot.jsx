import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, Bot, User, Sparkles, ShoppingCart } from 'lucide-react';
import { selectChatOpen, closeChat, toggleChat } from '../store/slices/uiSlice';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { formatPrice, DEMO_PRODUCTS } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const QUICK_REPLIES = [
  'Suggest me a smartwatch under $200',
  'Best fitness products',
  'Show wireless headphones',
  'What\'s new?',
  'Budget-friendly options',
];

const filterDemoProducts = (query) => {
  const lower = query.toLowerCase();
  let filtered = [...DEMO_PRODUCTS];
  if (lower.includes('watch') || lower.includes('smartwatch')) filtered = filtered.filter(p => p.category === 'smartwatch');
  else if (lower.includes('shoe') || lower.includes('sneaker')) filtered = filtered.filter(p => p.category === 'shoes');
  else if (lower.includes('headphone') || lower.includes('earbuds')) filtered = filtered.filter(p => p.category === 'headphones');
  else if (lower.includes('accessori')) filtered = filtered.filter(p => p.category === 'accessories');
  
  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) filtered = filtered.filter(p => p.price <= Number(priceMatch[1]));
  
  if (lower.includes('new')) filtered = filtered.filter(p => p.isNew);
  if (lower.includes('featured')) filtered = filtered.filter(p => p.isFeatured);
  if (lower.includes('budget') || lower.includes('cheap')) filtered = filtered.filter(p => p.price < 100);
  if (lower.includes('premium') || lower.includes('luxury')) filtered = filtered.filter(p => p.price > 150);
  
  return filtered.slice(0, 3);
};

export default function AIChatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectChatOpen);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 Hi! I\'m NexusAI, your personal shopping assistant! Ask me anything about products - like "Suggest a fitness smartwatch under $200" or "Show me wireless headphones"!',
      products: [],
      quickReplies: QUICK_REPLIES,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let response, products, quickReplies = [];
      try {
        const { data } = await api.post('/ai/chat', { message: text });
        response = data.response;
        products = data.products;
        quickReplies = data.quickReplies || [];
      } catch {
        // Fallback demo mode
        const filtered = filterDemoProducts(text);
        const greetings = ['Great question! 🎯', 'Awesome! 🚀', 'Sure thing! 😊'];
        const g = greetings[Math.floor(Math.random() * greetings.length)];
        response = `${g} Here are some products I found for you! Check these out:`;
        products = filtered.map(p => ({ _id: p._id, name: p.name, price: p.price, rating: p.rating, image: p.images[0], category: p.category, discount: p.discount }));
        quickReplies = ['Show more products', 'Budget options under $100', 'Top rated products'];
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: response, products, quickReplies }]);
        setLoading(false);
      }, 600);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I had trouble processing that. Try asking again! 🔄', products: [], quickReplies: QUICK_REPLIES }]);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      _id: product._id, name: product.name, price: product.price,
      image: product.image, quantity: 1,
    }));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #9f7aea)', boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-full sm:w-96 h-[550px] glass rounded-3xl shadow-glass flex flex-col overflow-hidden"
            style={{ maxWidth: 'calc(100vw - 24px)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(159,122,234,0.1))' }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white font-display">NexusAI Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-white/50">Online — AI Powered</span>
                </div>
              </div>
              <button onClick={() => dispatch(closeChat())} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gradient-to-br from-cyan-400 to-purple-600' : 'bg-gradient-to-br from-purple-600 to-pink-500'}`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`flex-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white ml-8'
                        : 'glass text-white/90 mr-8'
                    }`}>
                      {msg.text}
                    </div>
                    {/* Product Cards in Chat */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2 w-full">
                        {msg.products.map((product) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-3 flex gap-3"
                          >
                            <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium truncate">{product.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-yellow-400 text-xs">★</span>
                                <span className="text-white/50 text-xs">{product.rating}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="neon-text font-bold text-sm">{formatPrice(product.price)}</span>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-110 transition-transform"
                                >
                                  <ShoppingCart className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {/* Quick Replies */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && i === messages.length - 1 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((reply, ri) => (
                          <button
                            key={ri}
                            onClick={() => handleSend(reply)}
                            className="px-3 py-1.5 rounded-full text-xs glass border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="glass rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 input-field text-sm py-2.5 text-white placeholder-white/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50 hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
              <div className="flex items-center gap-1 mt-2 justify-center">
                <Sparkles className="w-3 h-3 text-white/30" />
                <span className="text-white/30 text-xs">Powered by NexusAI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
