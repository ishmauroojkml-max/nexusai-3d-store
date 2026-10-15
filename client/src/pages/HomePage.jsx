import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ArrowRight, Zap, Shield, Truck, Star, ChevronRight,
  Play, TrendingUp, Award, Users
} from 'lucide-react';
import { openChat } from '../store/slices/uiSlice';
import { DEMO_PRODUCTS, formatPrice } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const categories = [
  { name: 'Smartwatches', icon: '⌚', gradient: 'from-blue-500 to-cyan-500', path: '/shop?category=smartwatch', count: '24 items' },
  { name: 'Shoes', icon: '👟', gradient: 'from-orange-500 to-pink-500', path: '/shop?category=shoes', count: '18 items' },
  { name: 'Headphones', icon: '🎧', gradient: 'from-purple-500 to-indigo-500', path: '/shop?category=headphones', count: '15 items' },
  { name: 'Accessories', icon: '💡', gradient: 'from-green-500 to-teal-500', path: '/shop?category=accessories', count: '32 items' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers', icon: Users },
  { value: '500+', label: 'Products', icon: Award },
  { value: '4.9★', label: 'Average Rating', icon: Star },
  { value: '99%', label: 'Satisfaction', icon: TrendingUp },
];

const features = [
  { icon: Zap, title: '3D Product Preview', desc: 'Rotate, zoom and customize products in stunning 3D before buying', color: 'text-cyan-400' },
  { icon: Shield, title: 'Secure Payment', desc: 'Bank-grade encryption with Stripe payment gateway', color: 'text-purple-400' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $100. Same day dispatch', color: 'text-pink-400' },
  { icon: Star, title: 'AI Recommendations', desc: 'Get personalized product suggestions from our AI assistant', color: 'text-yellow-400' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState(DEMO_PRODUCTS.filter(p => p.isFeatured).slice(0, 4));
  const [newArrivals, setNewArrivals] = useState(DEMO_PRODUCTS.filter(p => p.isNew).slice(0, 4));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, shopRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products?isNew=true&limit=4'),
        ]);
        if (featRes.data.products?.length > 0) setFeaturedProducts(featRes.data.products);
        if (shopRes.data.products?.length > 0) setNewArrivals(shopRes.data.products);
      } catch { /* use demo data */ }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-gradient">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm"
              style={{ border: '1px solid rgba(0, 212, 255, 0.3)' }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/70">Powered by AI & Three.js Technology</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              <span className="text-white">Shop in</span>{' '}
              <span className="neon-text">3D</span>{' '}
              <span className="text-white">with</span><br />
              <span className="neon-text">AI Power</span>
            </h1>

            <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the future of shopping. View products in stunning 3D, customize colors in real-time, and get AI-powered recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                <Zap className="w-5 h-5" /> Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => dispatch(openChat())}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 text-white"
              >
                <Play className="w-5 h-5 fill-white" /> Try AI Assistant
              </button>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/demo?role=customer"
                className="glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:glow-blue transition-all">
                👤 Try Customer Mode
              </Link>
              <Link to="/demo?role=admin"
                className="glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:glow-purple transition-all">
                ⚙️ Try Admin Mode
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Product Images */}
          <div className="mt-16 relative">
            <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
              {DEMO_PRODUCTS.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="animate-float"
                  style={{ animationDelay: `${i * 2}s` }}
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 glass rounded-3xl overflow-hidden neon-border hover:scale-110 transition-transform cursor-pointer">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white/60 text-xs text-center mt-2">{product.name}</p>
                    <p className="neon-text text-sm font-bold text-center">{formatPrice(product.price)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center neon-border"
              >
                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-3xl font-bold neon-text">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-3">Shop by <span className="neon-text">Category</span></h2>
            <p className="text-white/50">Find exactly what you're looking for</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={cat.path} className="block">
                  <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group neon-border hover:glow-blue">
                    <div className={`text-4xl mb-4 bg-gradient-to-br ${cat.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                    <p className="text-white/40 text-sm">{cat.count}</p>
                    <ChevronRight className="w-4 h-4 text-cyan-400 mx-auto mt-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-display font-bold text-white">Featured <span className="neon-text">Products</span></h2>
              <p className="text-white/50 mt-1">Handpicked by our AI based on trends</p>
            </div>
            <Link to="/shop" className="btn-secondary flex items-center gap-2 text-white/70">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-display font-bold text-white">New <span className="neon-text">Arrivals</span></h2>
              <p className="text-white/50 mt-1">Fresh products just dropped</p>
            </div>
            <Link to="/shop?sort=new" className="btn-secondary flex items-center gap-2 text-white/70">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-3">Why <span className="neon-text">NexusAI?</span></h2>
            <p className="text-white/50">Next-generation shopping experience</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center neon-border hover:scale-105 transition-all"
              >
                <feature.icon className={`w-10 h-10 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(159,122,234,0.1))', border: '1px solid rgba(0, 212, 255, 0.2)' }}
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Experience the <span className="neon-text">Future?</span></h2>
            <p className="text-white/60 mb-8 text-lg">Join 10,000+ customers who are already shopping in 3D</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                <Zap className="w-5 h-5" /> Start Shopping
              </Link>
              <button onClick={() => dispatch(openChat())} className="btn-secondary text-white text-lg px-8 py-4">
                Chat with AI
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
