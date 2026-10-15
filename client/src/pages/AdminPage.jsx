import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Package, Users, DollarSign, ShoppingBag,
  TrendingUp, Plus, Edit3, Trash2, RefreshCw, AlertCircle,
  Check, X, ChevronDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { selectIsAdmin, selectIsAuthenticated } from '../store/slices/authSlice';
import { formatPrice, getStatusColor, DEMO_PRODUCTS } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'users', label: 'Users', icon: Users },
];

const DEMO_METRICS = {
  totalUsers: 1247,
  totalProducts: 48,
  totalOrders: 389,
  totalRevenue: 62847,
  pendingOrders: 23,
};

const DEMO_MONTHLY = [
  { month: 'May', revenue: 8200, orders: 45 },
  { month: 'Jun', revenue: 12400, orders: 67 },
  { month: 'Jul', revenue: 9800, orders: 54 },
  { month: 'Aug', revenue: 15600, orders: 89 },
  { month: 'Sep', revenue: 11200, orders: 63 },
  { month: 'Oct', revenue: 18700, orders: 98 },
];

const DEMO_CATEGORIES = [
  { name: 'Smartwatches', value: 35 },
  { name: 'Headphones', value: 28 },
  { name: 'Shoes', value: 22 },
  { name: 'Accessories', value: 15 },
];

const COLORS = ['#00d4ff', '#9f7aea', '#f687b3', '#48bb78'];

const DEMO_ORDERS = [
  { _id: 'order-001', user: { name: 'John Doe', email: 'john@example.com' }, totalPrice: 328, orderStatus: 'delivered', isPaid: true, createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
  { _id: 'order-002', user: { name: 'Jane Smith', email: 'jane@example.com' }, totalPrice: 179, orderStatus: 'shipped', isPaid: true, createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
  { _id: 'order-003', user: { name: 'Alex Chen', email: 'alex@example.com' }, totalPrice: 249, orderStatus: 'pending', isPaid: false, createdAt: new Date().toISOString() },
  { _id: 'order-004', user: { name: 'Sarah Kim', email: 'sarah@example.com' }, totalPrice: 99, orderStatus: 'confirmed', isPaid: true, createdAt: new Date(Date.now() - 3*60*60*1000).toISOString() },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(DEMO_METRICS);
  const [monthlyData, setMonthlyData] = useState(DEMO_MONTHLY);
  const [categoryData, setCategoryData] = useState(DEMO_CATEGORIES);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    // Admin access: allow demo users too
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, productsRes, ordersRes] = await Promise.allSettled([
        api.get('/admin/metrics'),
        api.get('/products'),
        api.get('/orders'),
      ]);
      if (metricsRes.status === 'fulfilled') {
        setMetrics(metricsRes.value.data.metrics);
        setMonthlyData(metricsRes.value.data.monthlyRevenue);
        setCategoryData(metricsRes.value.data.categoryBreakdown);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value.data.products?.length > 0) {
        setProducts(productsRes.value.data.products);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.orders?.length > 0) {
        setOrders(ordersRes.value.data.orders);
      }
    } catch { /* use demo data */ }
  };

  const handleSeedData = async () => {
    setSeedLoading(true);
    try {
      const { data } = await api.post('/admin/seed');
      toast.success(data.message || 'Demo data seeded! 🌱');
      fetchData();
    } catch {
      toast.error('Could not seed data (demo mode)');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? {...o, orderStatus: status} : o));
      toast.success('Order status updated!');
    } catch {
      setOrders(prev => prev.map(o => o._id === orderId ? {...o, orderStatus: status} : o));
      toast.success('Order status updated! (demo)');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
    } catch {}
    setProducts(prev => prev.filter(p => p._id !== productId));
    toast.success('Product deleted!');
  };

  const metricCards = [
    { label: 'Total Revenue', value: formatPrice(metrics.totalRevenue), icon: DollarSign, color: 'from-cyan-500 to-blue-600', change: '+18%' },
    { label: 'Total Orders', value: metrics.totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-pink-600', change: '+12%' },
    { label: 'Customers', value: metrics.totalUsers?.toLocaleString(), icon: Users, color: 'from-orange-500 to-red-600', change: '+24%' },
    { label: 'Products', value: metrics.totalProducts, icon: Package, color: 'from-green-500 to-teal-600', change: '+5%' },
  ];

  return (
    <div className="page-gradient min-h-screen pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 glass border-r border-white/10 min-h-screen pt-6 px-4 fixed top-16 left-0">
          <div className="mb-8">
            <h2 className="text-white font-display font-bold text-lg px-3">Admin Panel</h2>
            <p className="text-white/40 text-xs px-3 mt-1">NexusAI Management</p>
          </div>
          <nav className="space-y-1">
            {ADMIN_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400 border border-cyan-400/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <tab.icon className="w-5 h-5" />{tab.label}
                {tab.id === 'orders' && metrics.pendingOrders > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{metrics.pendingOrders}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-auto pb-6">
            <button onClick={handleSeedData} disabled={seedLoading}
              className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium glass text-white/50 hover:text-white transition-all">
              <RefreshCw className={`w-4 h-4 ${seedLoading ? 'animate-spin' : ''}`} />
              {seedLoading ? 'Seeding...' : 'Seed Demo Data'}
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-30 flex">
          {ADMIN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-all ${
                activeTab === tab.id ? 'text-cyan-400' : 'text-white/40'
              }`}>
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 px-4 sm:px-6 py-8 pb-24 lg:pb-8">

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-display font-bold text-white">Dashboard <span className="neon-text">Overview</span></h1>
                <button onClick={fetchData} className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-white/60 text-sm hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metricCards.map((card, i) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-white/50 text-xs mt-1">{card.label}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">{card.change} this month</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Revenue Overview</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="revenue" stroke="url(#revenueGradient)" strokeWidth={3} dot={{ fill: '#00d4ff', strokeWidth: 0 }} />
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#00d4ff" />
                          <stop offset="100%" stopColor="#9f7aea" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Sales by Category</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} paddingAngle={5} dataKey="value">
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {categoryData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-white/60">{item.name}</span>
                        </div>
                        <span className="text-white/40">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Chart */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Monthly Orders</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="orders" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9f7aea" />
                        <stop offset="100%" stopColor="#00d4ff" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Products <span className="neon-text">({products.length})</span></h2>
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-medium uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.images?.[0] || product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                                <p className="text-white/40 text-xs">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="tag">{product.category}</span></td>
                          <td className="px-4 py-3"><span className="neon-text font-semibold text-sm">{formatPrice(product.price)}</span></td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${product.stock <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-white/70 text-sm">{product.rating?.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <Edit3 className="w-4 h-4 text-cyan-400" />
                              </button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Orders <span className="neon-text">({orders.length})</span></h2>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-medium uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white/60 text-xs font-mono">#{order._id?.slice(-8)}</td>
                          <td className="px-4 py-3">
                            <p className="text-white text-sm">{order.user?.name || 'Unknown'}</p>
                            <p className="text-white/40 text-xs">{order.user?.email}</p>
                          </td>
                          <td className="px-4 py-3 neon-text font-semibold text-sm">{formatPrice(order.totalPrice)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${order.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                              {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="bg-transparent border border-white/20 rounded-lg text-white/60 text-xs px-2 py-1 cursor-pointer"
                            >
                              {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s} className="bg-gray-900">{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Users <span className="neon-text">({metrics.totalUsers})</span></h2>
              <div className="glass rounded-2xl p-8 text-center">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg">User management available with database connection</p>
                <p className="text-white/30 text-sm mt-2">Connect MongoDB to see all registered users</p>
                <button onClick={handleSeedData} disabled={seedLoading}
                  className="btn-primary mt-6 flex items-center gap-2 mx-auto">
                  <RefreshCw className={`w-4 h-4 ${seedLoading ? 'animate-spin' : ''}`} />
                  Seed Demo Data
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
