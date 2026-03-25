import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../store';
import { EWasteItem } from '../types';

interface PickupRequestModalProps {
  onClose: () => void;
  selectedItems: EWasteItem[];
}

export const PickupRequestModal: React.FC<PickupRequestModalProps> = ({ onClose, selectedItems }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { requestPickup } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    // Simulate geolocation or use browser API
    setTimeout(() => {
      requestPickup(selectedItems.map(i => i.id), address, 0, 0);
      setLoading(false);
      setSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  const totalPoints = selectedItems.reduce((acc, curr) => acc + curr.estimatedPoints, 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-black text-zinc-900">Request Pickup</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900">Request Sent!</h3>
              <p className="text-zinc-500">A collector will be notified shortly.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Items to Recycle ({selectedItems.length})</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-zinc-100 relative group">
                      <img src={item.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Total Reward</span>
                <span className="text-xl font-black text-emerald-600">{totalPoints} PTS</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Pickup Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address"
                      className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Request'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
