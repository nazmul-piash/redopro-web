import React, { useState } from 'react';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

interface PrivacyPolicyModalProps {
  onAccept: () => void;
  isOpen: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onAccept, isOpen }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    // Request permissions sequence
    try {
      // We don't strictly need to fail if these are denied, but we should ask.
      // In a web context, these might not trigger immediately or might be handled by the browser.
      // We just initiate the request here as per user requirement "ask for... access".
      
      // Camera (often includes Microphone permission in some contexts, or we can ask separately if needed)
      // Capacitor Camera plugin handles camera permissions.
      try {
        await Camera.requestPermissions();
      } catch (e) {
        console.warn("Camera permission request failed or dismissed", e);
      }

      // Location
      try {
        await Geolocation.requestPermissions();
      } catch (e) {
        console.warn("Location permission request failed or dismissed", e);
      }

    } catch (e) {
      console.error("Permission sequence error", e);
    }

    setIsClosing(true);
    setTimeout(() => {
      onAccept();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div className={`relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 duration-500 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-zinc-50 border-b border-zinc-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">Privacy & Data</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Transparency Protocol</p>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">Data Collection & Storage</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Redo Pro collects data to optimize e-waste recycling and logistics. This data is securely stored on our internal servers. 
              <span className="font-bold text-emerald-700 block mt-1">Your data stays within the system.</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">Third-Party Policy</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              We strictly adhere to a non-disclosure policy. 
              <span className="font-bold text-zinc-900"> We never share, sell, or distribute your personal data to third parties.</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">Required Permissions</h3>
            <ul className="space-y-3 mt-2">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p className="text-xs text-zinc-500"><span className="font-bold text-zinc-700">Location Access:</span> Used to coordinate pickups and find nearby recycling centers.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p className="text-xs text-zinc-500"><span className="font-bold text-zinc-700">Camera Access:</span> Required for the AI Neural Scanner to identify e-waste.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100">
          <button 
            onClick={handleAccept}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
          >
            Accept & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
