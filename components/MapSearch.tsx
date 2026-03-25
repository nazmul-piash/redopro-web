import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Loader2, Info } from 'lucide-react';
import { findRecyclingCenters } from '../geminiService';
import { GroundingResult } from '../types';

export const MapSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Try to get location first
      let lat, lng;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        console.warn("Location access denied or timed out");
      }

      const data = await findRecyclingCenters(query, lat, lng);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-1">
        <h3 className="text-xl font-black text-zinc-900 mb-4">Find Disposal Centers</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-[24px] shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all"
            placeholder="What do you need to recycle?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
            <Search className="w-6 h-6" />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            {loading ? '...' : 'Go'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Consulting Maps...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[28px] p-6 border border-zinc-100 shadow-sm">
             <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed italic">"{result.text}"</p>
             </div>

             <div className="space-y-3">
                {result.links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                          <MapPin className="w-6 h-6" />
                       </div>
                       <span className="text-sm font-black text-zinc-900 truncate max-w-[200px]">{link.title}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                  </a>
                ))}
             </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-10 opacity-40">
           <MapPin className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
           <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Search for local facilities</p>
        </div>
      )}
    </div>
  );
};
