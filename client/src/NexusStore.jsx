import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import { ShoppingCart, Bot, Sparkles, CheckCircle, Trash2, X, RefreshCw, Star, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

function Product3DModel({ shoeColor, isRotating }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2.4, 0.3, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 0.7, 1.1]} />
        <meshStandardMaterial color={shoeColor} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.4, 0.75, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.3, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.35, 0.56]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export default function NexusStore() {
  const [shoeColor, setShoeColor] = useState('#ef4444');
  const [isRotating, setIsRotating] = useState(true);
  const [selectedSize, setSelectedSize] = useState('42');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Nexus AI. Ask me for recommendations or style matching!' }
  ]);

  const productInfo = {
    id: 'nexus-3d-runner-01',
    name: 'Nexus Cyber-Runner 3D',
    price: 189,
    description: 'Next-generation footwear engineered with responsive 3D cushioning and real-time smart mesh customization.',
    rating: 4.9,
    reviews: 128
  };

  const availableColors = [
    { name: 'Cyber Red', hex: '#ef4444' },
    { name: 'Neon Blue', hex: '#3b82f6' },
    { name: 'Electric Green', hex: '#10b981' },
    { name: 'Stealth Black', hex: '#1e293b' },
    { name: 'Royal Gold', hex: '#f59e0b' }
  ];

  const addToCart = () => {
    const item = {
      id: `${productInfo.id}-${shoeColor}-${selectedSize}`,
      name: productInfo.name,
      price: productInfo.price,
      color: shoeColor,
      size: selectedSize
    };
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setIsCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 4000);
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    setAiQuery('');

    setTimeout(() => {
      let aiReply = "I recommend checking out the Cyber Red or Electric Green variants for a vibrant futuristic look!";
      const queryLower = userText.toLowerCase();

      if (queryLower.includes('color') || queryLower.includes('style')) {
        aiReply = "Electric Green and Neon Blue are currently trending! I have set the preview for you.";
        setShoeColor('#10b981');
      } else if (queryLower.includes('size') || queryLower.includes('fit')) {
        aiReply = "Nexus Cyber-Runners run true to size. Choose your standard EU size for optimal fit.";
      } else if (queryLower.includes('price') || queryLower.includes('discount')) {
        aiReply = `The current promotional price is $${productInfo.price} with free worldwide express shipping!`;
      }

      setChatMessages([...newMessages, { sender: 'ai', text: aiReply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-xl">
            N
          </div>
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NEXUS<span className="text-slate-100">AI 3D</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 transition"
          >
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">AI Stylist</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
          <div className="absolute top-4 left-4 z-10 bg-slate-950/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono text-cyan-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Interactive Viewport</span>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="absolute top-4 right-4 z-10 bg-slate-950/70 backdrop-blur p-2 rounded-full border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>

          <div className="w-full h-[380px]">
            <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={<Html center className="text-cyan-400">Loading 3D Engine...</Html>}>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                  <Product3DModel shoeColor={shoeColor} isRotating={isRotating} />
                </Float>
                <ContactShadows position={[0, -0.8, 0]} opacity={0.6} scale={10} blur={1.5} far={4} />
              </Suspense>
              <OrbitControls enableZoom={true} minDistance={2} maxDistance={7} />
            </Canvas>
          </div>

          <div className="text-center text-xs text-slate-500 font-mono">
            Drag to rotate • Scroll to zoom • Real-time 3D Shader active
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-sm font-semibold mb-2">
              <Zap className="w-4 h-4" />
              <span>Flagship Cyber Series</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">{productInfo.name}</h1>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold">{productInfo.rating}</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-sm text-slate-400">{productInfo.reviews} Verified Reviews</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {productInfo.description}
            </p>

            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                Select 3D Colorway
              </label>
              <div className="flex space-x-3">
                {availableColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setShoeColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-9 h-9 rounded-full transition-transform ${
                      shoeColor === color.hex ? 'ring-2 ring-cyan-400 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                Size (EU)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['40', '41', '42', '43', '44'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-sm font-mono rounded-xl border transition ${
                      selectedSize === size
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-mono block">Instant Delivery</span>
              <span className="text-3xl font-extrabold text-white">${productInfo.price}</span>
            </div>

            <button
              onClick={addToCart}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-8 py-3.5 rounded-2xl font-bold transition flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add To Order</span>
            </button>
          </div>
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <span>Your Shopping Cart</span>
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isCheckoutSuccess ? (
                <div className="my-12 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                  <p className="text-sm text-slate-400">Payment processed successfully in test mode.</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center my-16 text-slate-500">
                  Your cart is empty. Add a 3D customized item!
                </div>
              ) : (
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-slate-700"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <h4 className="text-sm font-bold">{item.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">Size: {item.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-sm">${item.price}</span>
                        <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isCheckoutSuccess && cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-cyan-400">${cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-2xl transition flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Complete Demo Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isAiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm">Nexus AI Assistant</span>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-950/50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/20 text-cyan-200 ml-auto border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 mr-auto border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAiSend} className="p-3 border-t border-slate-800 flex space-x-2 bg-slate-900">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask AI stylist..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button type="submit" className="bg-cyan-500 text-black px-3 py-2 rounded-xl font-bold text-xs hover:bg-cyan-400">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}