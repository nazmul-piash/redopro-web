import React from 'react';
import { useApp, AppProvider } from './store';
import { Role } from './types';
import { LandingPage } from './components/LandingPage';
import { UserDashboard, CollectorDashboard } from './components/Dashboards';
import { LogOut, Shield, Info } from 'lucide-react';

const ConfigCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'TODO_KEYHERE') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-zinc-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-zinc-100 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Configuration Required</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            The Gemini API key is missing. Please add it to your <code className="bg-zinc-100 px-2 py-1 rounded text-emerald-600 font-mono">.env</code> file as <code className="bg-zinc-100 px-2 py-1 rounded text-emerald-600 font-mono">GEMINI_API_KEY</code>.
          </p>
          <div className="bg-zinc-50 p-4 rounded-2xl text-left border border-zinc-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Example .env</span>
            </div>
            <code className="text-xs font-mono text-zinc-600 block">GEMINI_API_KEY=your_api_key_here</code>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

const MainApp: React.FC = () => {
  const { currentUser, logout } = useApp();

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100">
      <div className="w-full min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100">
          <div className="flex items-center gap-3 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">
                R
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter leading-none">Redo Pro</h1>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                  {currentUser.role === Role.USER ? 'Recycler' : 'Collector'} Profile
                </p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-3 bg-zinc-100 text-zinc-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentUser.role === Role.USER && <UserDashboard />}
          {currentUser.role === Role.COLLECTOR && <CollectorDashboard />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigCheck>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ConfigCheck>
  );
};

export default App;
