import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg neon-text">NexusAI Store</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">The future of shopping — 3D interactive products powered by AI. Experience shopping like never before.</p>
            <div className="flex gap-3 mt-6">
              {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-xl glass hover:glow-blue transition-all">
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Shop', 'About', 'Contact'].map(link => (
                <li key={link}><Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-white/50 hover:text-white text-sm transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {['Smartwatches', 'Shoes', 'Headphones', 'Accessories'].map(cat => (
                <li key={cat}><Link to={`/shop?category=${cat.toLowerCase()}`} className="text-white/50 hover:text-white text-sm transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/50 text-sm"><Mail className="w-4 h-4 text-cyan-400" /><span>support@nexusai.store</span></li>
              <li className="flex items-center gap-2 text-white/50 text-sm"><Phone className="w-4 h-4 text-cyan-400" /><span>+1 (555) 123-4567</span></li>
              <li className="flex items-center gap-2 text-white/50 text-sm"><MapPin className="w-4 h-4 text-cyan-400" /><span>San Francisco, CA</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">© 2024 NexusAI Store. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
