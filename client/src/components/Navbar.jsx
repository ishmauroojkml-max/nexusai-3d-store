import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart, Search, Sun, Moon, Menu, X,
  User, LogOut, Settings, ChevronDown, Zap
} from 'lucide-react';
import { toggleDarkMode, toggleCart, toggleMobileMenu, closeMobileMenu, selectDarkMode, selectMobileMenuOpen } from '../store/slices/uiSlice';
import { selectCartCount, openCart } from '../store/slices/cartSlice';
import { selectUser, selectIsAuthenticated, selectIsAdmin, logout } from '../store/slices/authSlice';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Categories', path: '/shop', dropdown: ['Smartwatches', 'Shoes', 'Headphones', 'Accessories'] },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector(selectDarkMode);
  const mobileMenuOpen = useSelector(selectMobileMenuOpen);
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchVisible(false);
      setSearchQuery('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center glow-blue group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg neon-text">NexusAI</span>
              <span className="text-white/60 text-sm ml-1">Store</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium hover:neon-text">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <AnimatePresence>
              {searchVisible && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-field text-sm py-2 text-white placeholder-white/40"
                    onBlur={() => !searchQuery && setSearchVisible(false)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className="p-2 rounded-xl glass hover:glow-blue transition-all"
            >
              <Search className="w-5 h-5 text-white/70" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl glass hover:glow-purple transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(openCart())}
              className="relative p-2 rounded-xl glass hover:glow-blue transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-white/70" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full text-xs flex items-center justify-center text-white font-bold"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:glow-blue transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 hidden sm:block max-w-24 truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl overflow-hidden shadow-glass z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-white text-sm font-medium">{user?.name}</p>
                          <p className="text-white/40 text-xs">{user?.email}</p>
                          {isAdmin && <span className="tag text-xs mt-1 inline-block">Admin</span>}
                        </div>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 text-sm transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 text-sm transition-colors">
                            <Settings className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400 text-sm w-full text-left transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-xl glass"
              onClick={() => dispatch(toggleMobileMenu())}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass rounded-2xl mb-4 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    {link.name}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => dispatch(closeMobileMenu())}
                    className="block btn-primary text-center mt-2">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
