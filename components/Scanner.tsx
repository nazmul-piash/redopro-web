import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { classifyEWaste, ClassificationResult } from '../geminiService';
import { useApp } from '../store';

interface ScannerProps {
  onClose: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenValue, setTokenValue] = useState(10);
  const [isPublic, setIsPublic] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addItem } = useApp();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Camera access denied. Please check permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        analyzeImage(dataUrl);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await classifyEWaste(base64);
      setResult(data);
      setTokenValue(Math.floor(data.estimatedPoints / 10)); // Default token value
    } catch {
      setError('Failed to identify item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result && image) {
      addItem({
        name: result.name,
        category: result.category,
        estimatedPoints: result.estimatedPoints,
        tokenValue: tokenValue,
        description: result.description,
        imageUrl: image,
        isPublic: isPublic,
        location: isPublic ? { lat: 37.7749, lng: -122.4194, city: 'San Francisco' } : undefined
      });
      onClose();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-[100] bg-white flex flex-col"
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Scan E-Waste</h2>
        <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {!image ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-[2px] border-white/30 m-12 rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>
            </div>
            <button 
              onClick={captureImage}
              className="absolute bottom-12 w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-full"></div>
            </button>
          </>
        ) : (
          <img src={image} className="w-full h-full object-cover" />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <AnimatePresence>
        {(loading || result || error) && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white p-6 rounded-t-[32px] shadow-2xl min-h-[300px]"
          >
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-zinc-500 font-medium">AI is identifying your item...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-red-500 font-medium">{error}</p>
                <button 
                  onClick={() => { setImage(null); setResult(null); setError(null); startCamera(); }}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold"
                >
                  Try Again
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900">{result.name}</h3>
                    <p className="text-emerald-600 font-bold uppercase text-xs tracking-widest">{result.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-600">+{result.estimatedPoints}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Estimated Points</p>
                  </div>
                </div>
                
                <p className="text-zinc-600 text-sm leading-relaxed">{result.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Marketplace Price</label>
                    <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      <input 
                        type="number" 
                        value={tokenValue}
                        onChange={(e) => setTokenValue(parseInt(e.target.value))}
                        className="bg-transparent w-full font-black text-emerald-600 outline-none"
                      />
                      <span className="text-[10px] font-black text-zinc-400">TOKENS</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Visibility</label>
                    <button 
                      onClick={() => setIsPublic(!isPublic)}
                      className={`w-full p-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${isPublic ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-zinc-50 border-zinc-100 text-zinc-400'}`}
                    >
                      {isPublic ? 'Public' : 'Private'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { setImage(null); setResult(null); startCamera(); }}
                    className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-emerald-200"
                  >
                    Add to Inventory
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
