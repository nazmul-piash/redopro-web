import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LogIn, User, Truck, Search, MapPin, Heart, Share2,
  Cpu, Laptop, Smartphone as Phone, Gamepad2, Headphones, Camera
} from 'lucide-react';
import { Role } from '../types';
import { useApp } from '../store';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ city: string; lat: number; lng: number } | null>(null);
  const { login, signup, marketplaceItems } = useApp();

  useEffect(() => {
    // Simulate location detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd reverse geocode this. For now, mock it.
          setUserLocation({
            city: 'San Francisco',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ city: 'New York', lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email.trim()) {
        login(email, role);
      }
    } else {
      if (email.trim() && name.trim()) {
        signup(email, name, role);
      }
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    { name: 'Computers', icon: Laptop, color: 'bg-blue-50 text-blue-600' },
    { name: 'Phones', icon: Phone, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Gaming', icon: Gamepad2, color: 'bg-purple-50 text-purple-600' },
    { name: 'Audio', icon: Headphones, color: 'bg-orange-50 text-orange-600' },
    { name: 'Cameras', icon: Camera, color: 'bg-red-50 text-red-600' },
    { name: 'Components', icon: Cpu, color: 'bg-zinc-50 text-zinc-600' },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Poshmark-style Header */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-zinc-100 px-4 md:px-8 py-3 flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black">R</div>
          <span className="font-black text-xl tracking-tighter hidden sm:block">Redo Pro</span>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search for e-waste, parts, or vintage tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-zinc-100 border-transparent focus:bg-white focus:border-emerald-600/20 rounded-full outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          <button onClick={scrollToLogin} className="text-sm font-bold text-zinc-600 hover:text-emerald-600 transition-colors uppercase tracking-widest hidden md:block">
            Sell on Redo
          </button>
          <div className="h-4 w-[1px] bg-zinc-200 hidden md:block" />
          <button onClick={scrollToLogin} className="text-sm font-bold text-zinc-900 hover:text-emerald-600 transition-colors uppercase tracking-widest">
            Login
          </button>
          <button 
            onClick={scrollToLogin}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[48px] overflow-hidden bg-zinc-900 aspect-[21/9] flex items-center px-8 md:px-16">
          <img 
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
            alt="Hero background"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6">
                THE LARGEST <br />
                <span className="text-emerald-500 text-glow">E-WASTE</span> <br />
                MARKETPLACE.
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 font-medium mb-8 max-w-lg">
                Shop vintage tech, sell your old devices for tokens, and join the circular economy.
              </p>
              <div className="flex gap-4">
                <button onClick={scrollToLogin} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-900/40">
                  SHOP NOW
                </button>
                <button onClick={scrollToLogin} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black hover:bg-white/20 transition-all active:scale-95">
                  SELL ON REDO
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-4 p-6 rounded-[32px] bg-zinc-50 border border-zinc-100 cursor-pointer group transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-100"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <span className="font-bold text-sm uppercase tracking-widest">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2">
              <MapPin className="w-4 h-4" />
              <span>Nearby in {userLocation?.city || 'Your Area'}</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter">TRENDING NEAR YOU</h2>
          </div>
          <button className="text-sm font-black text-emerald-600 hover:underline uppercase tracking-widest">
            View All Marketplace
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {marketplaceItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[32px] overflow-hidden bg-zinc-100 mb-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
                  </button>
                  <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors">
                    <Share2 className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {item.tokenValue} TOKENS
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-lg tracking-tight uppercase group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  <span>{item.category}</span>
                  <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                  <span>{item.location.city}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Auth Section (Poshmark Style) */}
      <section id="login" className="py-24 px-4 md:px-8 bg-zinc-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              JOIN THE <br />
              <span className="text-emerald-600">RECYCLING</span> <br />
              COMMUNITY.
            </h2>
            <p className="text-xl text-zinc-500 font-medium mb-12 leading-relaxed">
              Create an account to start selling your old tech, earning tokens, and discovering unique vintage pieces.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-zinc-900 mb-1">50K+</div>
                <div className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-black text-zinc-900 mb-1">120K+</div>
                <div className="text-xs font-black text-zinc-400 uppercase tracking-widest">Items Recycled</div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[48px] p-10 shadow-2xl shadow-zinc-200 border border-zinc-100"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-black tracking-tighter mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-zinc-400 font-medium">{isLogin ? 'Enter your details to login' : 'Fill in the form to get started'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: Role.USER, label: 'User', icon: User },
                    { id: Role.COLLECTOR, label: 'Collector', icon: Truck },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        role === r.id 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                          : 'border-zinc-100 bg-white text-zinc-400 grayscale hover:grayscale-0'
                      }`}
                    >
                      <r.icon className="w-6 h-6 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" />
                {isLogin ? 'Enter Terminal' : 'Join Redo Pro'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 pb-20 mb-10 border-b border-zinc-100">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl">R</div>
              <span className="font-black text-3xl tracking-tighter">Redo Pro</span>
            </div>
            <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
              The world's first AI-powered e-waste marketplace. Shop, sell, and recycle with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-zinc-400">Marketplace</h4>
            <ul className="space-y-4 text-zinc-600 font-bold text-sm uppercase tracking-widest">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Computers</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Phones</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Gaming</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Audio</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-zinc-400">Company</h4>
            <ul className="space-y-4 text-zinc-600 font-bold text-sm uppercase tracking-widest">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 Redo Pro. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
