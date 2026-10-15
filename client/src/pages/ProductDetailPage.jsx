import { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Share2, Star, Check, ArrowLeft, Package, Truck, Shield, RotateCcw, ZoomIn } from 'lucide-react';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { formatPrice, DEMO_PRODUCTS } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

// 3D Model Component (fallback geometric shape if no .glb)
function Product3DModel({ color }) {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh castShadow>
          <torusGeometry args={[1.2, 0.3, 32, 100]} />
          <meshStandardMaterial color={color || '#00d4ff'} metalness={0.8} roughness={0.1} envMapIntensity={1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={color || '#9f7aea'} metalness={0.9} roughness={0.05} envMapIntensity={1} />
        </mesh>
      </Float>
    </group>
  );
}

function WatchModel({ color }) {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.4}>
      <group>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.5, 0.3]} />
          <meshStandardMaterial color={color || '#1a1a2e'} metalness={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
          <meshStandardMaterial color={color || '#00d4ff'} metalness={0.9} roughness={0.05} />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
          <meshStandardMaterial color={color || '#00d4ff'} metalness={0.9} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[1.0, 1.3, 0.02]} />
          <meshStandardMaterial color={color || '#0066ff'} emissive={color || '#003399'} emissiveIntensity={0.3} metalness={0.1} roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function ShoeModel({ color }) {
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.3}>
      <group rotation={[0.2, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={color || '#0066ff'} metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.4, 0.3]} castShadow>
          <boxGeometry args={[1.6, 0.2, 1.8]} />
          <meshStandardMaterial color={'#1a1a1a'} metalness={0.3} roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

function HeadphoneModel({ color }) {
  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.5}>
      <group>
        <mesh castShadow>
          <torusGeometry args={[1.0, 0.1, 16, 100, Math.PI]} />
          <meshStandardMaterial color={color || '#0d0d0d'} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
          <meshStandardMaterial color={color || '#1a1a1a'} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[1.0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
          <meshStandardMaterial color={color || '#1a1a1a'} metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function Get3DModel({ category, color }) {
  switch(category) {
    case 'smartwatch': return <WatchModel color={color} />;
    case 'shoes': return <ShoeModel color={color} />;
    case 'headphones': return <HeadphoneModel color={color} />;
    default: return <Product3DModel color={color} />;
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setSelectedColor(data.product.colors?.[0]?.hex || '#00d4ff');
      setSelectedSize(data.product.sizes?.[0]);
    } catch {
      const demo = DEMO_PRODUCTS.find(p => p._id === id) || DEMO_PRODUCTS[0];
      setProduct(demo);
      setSelectedColor(demo.colors?.[0]?.hex || '#00d4ff');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id, name: product.name, price: product.price,
      image: product.images?.[0], selectedColor: selectedColor,
      selectedSize, quantity,
    }));
    dispatch(openCart());
    toast.success(`${product.name} added to cart! 🛒`);
  };

  if (loading) {
    return (
      <div className="page-gradient min-h-screen flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="page-gradient min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: 3D Viewer */}
          <div>
            <div className="sticky top-24">
              {/* Toggle */}
              <div className="flex gap-2 mb-4">
                <button onClick={() => setShow3D(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                    show3D ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'glass text-white/60'
                  }`}>
                  <RotateCcw className="w-4 h-4" /> 3D View
                </button>
                <button onClick={() => setShow3D(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                    !show3D ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'glass text-white/60'
                  }`}>
                  <ZoomIn className="w-4 h-4" /> Photo
                </button>
              </div>

              <AnimatePresence mode="wait">
                {show3D ? (
                  <motion.div
                    key="3d"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-3xl overflow-hidden neon-border"
                    style={{ height: '480px' }}
                  >
                    <Canvas
                      shadows
                      camera={{ position: [0, 0, 4], fov: 50 }}
                      gl={{ antialias: true, alpha: true }}
                    >
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#9f7aea" />
                      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
                      <Suspense fallback={null}>
                        <Environment preset="city" />
                        <Get3DModel category={product.category} color={selectedColor} />
                      </Suspense>
                      <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate autoRotateSpeed={1} />
                    </Canvas>
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white/30 text-xs">🖱️ Drag to rotate • Scroll to zoom</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-3xl overflow-hidden neon-border aspect-square"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Color customizer label */}
              {show3D && product.colors?.length > 0 && (
                <div className="mt-4 glass rounded-xl p-3">
                  <p className="text-white/50 text-xs text-center">🎨 Select a color below to see it in 3D real-time</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag">{product.category}</span>
                {product.isNew && <span className="badge-new">NEW</span>}
                {product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} numReviews={product.numReviews} size="md" />
                <span className="text-white/30 text-sm">•</span>
                <span className="text-white/50 text-sm">{product.brand}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold neon-text">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount > 0 && (
                <span className="glass px-3 py-1 rounded-full text-green-400 text-sm font-medium">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* Color Picker */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-white/60 text-sm font-medium mb-3">
                  Color: <span className="text-white">{product.colors.find(c => c.hex === selectedColor)?.name}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.hex)}
                      title={color.name}
                      className={`w-10 h-10 rounded-full transition-all relative ${
                        selectedColor === color.hex
                          ? 'ring-2 ring-offset-2 ring-offset-transparent ring-cyan-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex, border: color.hex === '#ffffff' ? '2px solid rgba(255,255,255,0.3)' : 'none' }}
                    >
                      {selectedColor === color.hex && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-white/60 text-sm font-medium mb-3">Size: <span className="text-white">{selectedSize}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                          : 'glass text-white/60 hover:text-white'
                      }`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-white/60 text-sm font-medium">Quantity:</p>
              <div className="flex items-center gap-3 glass rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors">−</button>
                <span className="text-white font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors">+</button>
              </div>
              <span className="text-white/40 text-sm">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={() => setLiked(!liked)} className={`p-4 rounded-xl glass transition-all ${ liked ? 'bg-red-500/20' : 'hover:glow-blue'}`}>
                <Heart className={`w-6 h-6 ${liked ? 'text-red-400 fill-red-400' : 'text-white/60'}`} />
              </button>
              <button className="p-4 rounded-xl glass hover:glow-blue transition-all">
                <Share2 className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders $100+' },
                { icon: Shield, label: 'Secure Pay', sub: 'SSL Encrypted' },
                { icon: Package, label: 'Easy Returns', sub: '30-day policy' },
              ].map(badge => (
                <div key={badge.label} className="glass rounded-xl p-3 text-center">
                  <badge.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-medium">{badge.label}</p>
                  <p className="text-white/30 text-xs">{badge.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-2 border-b border-white/10 mb-4">
                {['description', 'features', 'reviews'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 ${
                      activeTab === tab ? 'text-cyan-400 border-cyan-400' : 'text-white/40 border-transparent hover:text-white'
                    }`}>{tab}</button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.p key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-white/60 text-sm leading-relaxed">
                    {product.description}
                  </motion.p>
                )}
                {activeTab === 'features' && (
                  <motion.div key="feat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    {(product.features || ['Premium Quality', 'Durable Design', 'Warranty Included']).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/70 text-sm">{feat}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'reviews' && (
                  <motion.div key="rev" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {product.numReviews > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 glass rounded-xl p-4">
                          <div className="text-center">
                            <p className="text-4xl font-bold neon-text">{product.rating?.toFixed(1)}</p>
                            <StarRating rating={product.rating} size="sm" />
                            <p className="text-white/40 text-xs mt-1">{product.numReviews} reviews</p>
                          </div>
                        </div>
                        {product.reviews?.slice(0, 3).map((review, i) => (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-white font-medium text-sm">{review.name}</p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-white/60 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">No reviews yet. Be the first to review!</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
