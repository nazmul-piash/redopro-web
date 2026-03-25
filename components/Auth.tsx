import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Role } from '../types';
import { useApp } from '../store';
import { LogIn, User, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email, role);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans text-zinc-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-zinc-200 border border-zinc-100 relative"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-3 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-emerald-200 rotate-[-6deg] mb-6">
            R
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Redo Pro</h1>
          <p className="text-zinc-400 font-medium text-sm mt-2">The Future of E-Waste Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: Role.USER, label: 'User', icon: User },
                { id: Role.COLLECTOR, label: 'Collector', icon: Truck },
                { id: Role.ADMIN, label: 'Admin', icon: ShieldCheck },
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
            Enter Terminal
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
          Secure Environment v1.1.0
        </p>
      </motion.div>
    </div>
  );
};
