import React from 'react';

interface Props {
  onClose: () => void;
}

export const DownloadPanel: React.FC<Props> = ({ onClose }) => {
  /**
   * Generates a clean, scan-friendly URL.
   * Uses the native URL API to avoid string concatenation bugs
   * that can lead to malformed hostnames like the ones seen in some sandbox environments.
   */
  const getAppUrl = () => {
    try {
      const url = new URL(window.location.href);
      // Strip everything except protocol, host, and path for a clean PWA install link
      return `${url.protocol}//${url.host}${url.pathname}`;
    } catch {
      // Basic fallback
      return window.location.origin + window.location.pathname;
    }
  };

  const cleanUrl = getAppUrl();
  
  // QRServer is highly reliable for standard URL encoding
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(cleanUrl)}&ecc=M&margin=1`;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <h2 className="text-xl font-black text-zinc-900 tracking-tighter flex items-baseline gap-1">
            Get Redo <span className="text-xs font-bold opacity-40">Pro</span>
          </h2>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-400 shadow-sm active:scale-90 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-white border-2 border-emerald-50 rounded-[40px] shadow-inner">
            <div className="p-4 bg-white rounded-[32px] shadow-lg border border-zinc-100 overflow-hidden">
               <img 
                 src={qrUrl} 
                 alt="App QR Code" 
                 className="w-56 h-56 block"
                 onError={(e) => {
                   // Fallback to QuickChart if QRServer is unreachable
                   (e.target as HTMLImageElement).src = `https://quickchart.io/qr?text=${encodeURIComponent(cleanUrl)}&size=300`;
                 }}
               />
            </div>
          </div>

          <h3 className="text-lg font-black text-zinc-800 mb-2">Scan with Camera</h3>
          <p className="text-sm text-zinc-500 font-medium mb-4 max-w-[280px]">
            Scan to open <b>Redo <small className="text-sm font-bold opacity-60">Pro</small></b> on your phone.
          </p>

          {/* URL Debug/Verify area */}
          <div className="mb-8 w-full px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden">
             <p className="text-xs font-mono text-zinc-400 break-all select-all text-center">{cleanUrl}</p>
          </div>

          <div className="w-full space-y-3">
            <div className="bg-emerald-50 p-5 rounded-[24px] flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Android</p>
                <p className="text-sm text-emerald-600 font-medium leading-tight">In Chrome, tap the (⋮) menu and select "Install app".</p>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-[24px] flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 013 3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <div>
                <p className="text-xs font-black text-blue-800 uppercase tracking-widest">iOS (Safari)</p>
                <p className="text-sm text-blue-600 font-medium leading-tight">Tap the Share button and select "Add to Home Screen".</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(cleanUrl);
              alert("App link copied to clipboard!");
            }}
            className="mt-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Copy URL Link
          </button>
        </div>
      </div>
    </div>
  );
};