# NexusAI 3D Store 🚀

> A full-stack 3D interactive e-commerce store powered by AI, Three.js, and MERN Stack.

![NexusAI Store](https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format)

## ✨ Features

- **🎮 Interactive 3D Product Viewer** - Three.js with OrbitControls, real-time color customization
- **🤖 AI Shopping Assistant** - Smart chatbot with product recommendations
- **🌙 Dark Mode** - Glassmorphic design with smooth animations (Framer Motion)
- **🔐 JWT Authentication** - Secure login/register with refresh tokens
- **🛒 Redux Cart** - Real-time cart with localStorage persistence
- **💳 Stripe Payment** - Full checkout flow (test mode)
- **📊 Admin Dashboard** - Sales metrics, order management, inventory
- **📱 Fully Responsive** - Mobile-first design
- **⚡ Fast Loading** - Code splitting, lazy loading, optimized assets

 🏃 Quick Start
 One-Click Demo
Visit the homepage and click:
- **👤 Try Customer Mode** - Instant customer access
- **⚙️ Try Admin Mode** - Full admin dashboard access

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexusai.com | DemoPass123! |
| Customer | demo@nexusai.com | DemoPass123! |

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Three.js / @react-three/fiber / @react-three/drei
- Framer Motion
- Tailwind CSS (dark mode + glassmorphism)
- Redux Toolkit
- Axios
- Stripe.js

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Stripe API
- bcryptjs, helmet, cors

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and Stripe keys
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 🎉

## 📁 Project Structure

```
NexusAI 3D Store/
├── client/                    # React Vite frontend
│   ├── src/
│   │   ├── components/        # Navbar, Cart, AI Chatbot, etc.
│   │   ├── pages/             # Home, Shop, Product, Admin, etc.
│   │   ├── store/             # Redux slices (cart, auth, ui)
│   │   └── utils/             # API client, helpers
│   └── package.json
├── server/                    # Express backend
│   ├── config/                # DB connection
│   ├── controllers/           # Auth, Products, Orders, AI, Admin
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # User, Product, Order sche

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway or Render
3. Set environment variables from `.env.example`
4. Deploy!

## 💳 Stripe Test Mode

Use card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVV: Any 3 digits

## 🎨 Design Features

- **Glassmorphism** - `backdrop-blur` + semi-transparent backgrounds
- **Neon Effects** - Cyan (#00d4ff) + Purple (#9f7aea) gradients
- **Dark Mode** - Full dark/light mode toggle with localStorage persistence
- **Animations** - Framer Motion page transitions, hover effects, micro-interactions
- **3D Viewer** - Real-time color/texture changes in Three.js canvas

## 📱 Responsive Design

Fully responsive across all screen sizes:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1440px+

---

Made with ❤️ using MERN + Three.js + Framer Motion

