import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../store';
import { ItemStatus, PickupStatus, Role } from '../types';
import { Scanner } from './Scanner';
import { PickupRequestModal } from './PickupRequestModal';
import { MapSearch } from './MapSearch';
import { 
  Package, 
  Map, 
  History, 
  Trash2, 
  Zap, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  Heart,
  ShoppingBag,
  LayoutDashboard,
  User as UserIcon,
  Lightbulb,
  Factory,
  Navigation
} from 'lucide-react';

const M3Chip = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        [ItemStatus.STORED]: 'bg-blue-100 text-blue-800 border-blue-200',
        [ItemStatus.PICKUP_REQUESTED]: 'bg-amber-100 text-amber-800 border-amber-200',
        [ItemStatus.IN_PROGRESS]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        [ItemStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        [PickupStatus.PENDING]: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${colors[status] || 'bg-zinc-100'}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

const M3Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[28px] p-5 shadow-sm border border-zinc-100/50 ${className} ${onClick ? 'cursor-pointer active:scale-95 transition-all' : ''}`}
  >
    {children}
  </div>
);

export const UserDashboard: React.FC = () => {
  const { currentUser, items, deleteItem, marketplaceItems, publishToMarketplace } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'items' | 'marketplace' | 'history' | 'profile'>('marketplace');
  const [showScanner, setShowScanner] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [radius, setRadius] = useState(50);

  if (!currentUser) return null;

  const myItems = items.filter(i => i.userId === currentUser.id);
  const activeItems = myItems.filter(i => i.status !== ItemStatus.COMPLETED);
  const historyItems = myItems.filter(i => i.status === ItemStatus.COMPLETED);
  const requestableItems = activeItems.filter(i => i.status === ItemStatus.STORED);

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) * 111;
  };

  const nearbyItems = marketplaceItems.filter(item => {
    const userLat = 37.7749;
    const userLng = -122.4194;
    const dist = getDistance(userLat, userLng, item.location.lat, item.location.lng);
    return dist <= radius;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter">Marketplace</h2>
                <p className="text-zinc-500 font-medium">Discover tech near you</p>
              </div>
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Radius: {radius}km</span>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="accent-emerald-600"
                />
              </div>
            </div>

            {nearbyItems.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[48px] border border-dashed border-zinc-200">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-2">No offerings right now</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Try increasing your search radius or check back later for new items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nearbyItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white rounded-[32px] overflow-hidden border border-zinc-100 hover:shadow-xl hover:shadow-zinc-100 transition-all"
                  >
                    <div className="relative aspect-square">
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                      <div className="absolute top-4 right-4">
                        <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {item.tokenValue} TOKENS
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-black text-lg tracking-tight uppercase mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        <span>{item.category}</span>
                        <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                        <span>{item.location.city}</span>
                      </div>
                      <button className="w-full mt-4 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      case 'home':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="w-24 h-24" />
              </div>
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Balance</p>
              <h2 className="text-5xl font-black tracking-tighter mb-6">{currentUser.points.toLocaleString()} <span className="text-lg font-medium opacity-50">PTS</span></h2>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 rounded-2xl p-3">
                  <p className="text-[10px] font-bold opacity-60 uppercase">Inventory</p>
                  <p className="text-lg font-black">{activeItems.length}</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl p-3">
                  <p className="text-[10px] font-bold opacity-60 uppercase">Recycled</p>
                  <p className="text-lg font-black">{historyItems.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPickupModal(true)}
                disabled={requestableItems.length === 0}
                className={`p-6 rounded-[28px] flex flex-col items-center gap-3 transition-all border ${requestableItems.length > 0 ? 'bg-white border-emerald-100 shadow-sm active:scale-95' : 'bg-zinc-100 border-zinc-200 opacity-50 grayscale'}`}
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                   <Truck className="w-6 h-6" />
                </div>
                <span className="font-black text-xs text-zinc-700 uppercase">Pickup Request</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-6 rounded-[28px] bg-white border border-emerald-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                   <UserIcon className="w-6 h-6" />
                </div>
                <span className="font-black text-xs text-zinc-700 uppercase">My Profile</span>
              </button>
            </div>

            <div className="space-y-4">
               <h3 className="text-xl font-black text-zinc-900">Hints & Tools</h3>
               <M3Card className="bg-zinc-900 text-white border-none">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-black text-white">Did you know?</p>
                        <p className="text-xs text-zinc-400 font-medium mb-4">Scanning your old tech helps us classify e-waste and gives you instant token estimates.</p>
                        <button 
                          onClick={() => setShowScanner(true)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                        >
                          Start Scanning
                        </button>
                     </div>
                  </div>
               </M3Card>
            </div>
            
            <div className="p-1">
               <h3 className="text-xl font-black text-zinc-900 mb-4">Eco Performance</h3>
               <M3Card>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-black text-zinc-800">Rising Star</p>
                        <p className="text-[10px] text-zinc-500 font-medium">You are in the top 15% of recyclers this month!</p>
                     </div>
                  </div>
               </M3Card>
            </div>
          </div>
        );
      case 'items':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black text-zinc-900">Stored Items</h3>
                <span className="text-[10px] font-black text-zinc-400 uppercase">{activeItems.length} Un-recycled</span>
             </div>
             {activeItems.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-zinc-100 rounded-[24px] mx-auto flex items-center justify-center text-zinc-300 mb-4">
                     <Package className="w-10 h-10" />
                  </div>
                  <p className="font-bold text-zinc-400">Inventory Empty</p>
               </div>
             ) : (
               activeItems.map(item => (
                 <M3Card key={item.id} className="flex gap-4 p-4 border-emerald-50">
                    <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover bg-zinc-100 shadow-sm" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-zinc-900 truncate text-sm">{item.name}</h4>
                          <span className="text-emerald-600 font-black text-sm">+{item.estimatedPoints}</span>
                       </div>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{item.category}</p>
                       <div className="flex justify-between items-center mt-2">
                          <M3Chip status={item.status} />
                          <div className="flex gap-2">
                             {item.status === ItemStatus.STORED && !item.isPublic && (
                               <button 
                                 onClick={() => publishToMarketplace(item.id, Math.floor(item.estimatedPoints / 10))}
                                 className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                               >
                                  Sell
                               </button>
                             )}
                             {item.status === ItemStatus.STORED && (
                               <button onClick={() => deleteItem(item.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-5 h-5" />
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                 </M3Card>
               ))
             )}
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center text-emerald-600 text-3xl font-black">
                   {currentUser.name[0].toUpperCase()}
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tighter">{currentUser.name}</h2>
                   <p className="text-zinc-500 font-medium">{currentUser.email}</p>
                   <div className="mt-2 flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                         {currentUser.role === Role.USER ? 'Recycler' : 'Collector'}
                      </span>
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                         {currentUser.points} Points
                      </span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <M3Card>
                   <h3 className="text-lg font-black tracking-tight uppercase mb-4">My Listings</h3>
                   <div className="space-y-4">
                      {myItems.filter(i => i.isPublic).length === 0 ? (
                        <p className="text-zinc-400 text-sm font-medium">No public listings yet.</p>
                      ) : (
                        myItems.filter(i => i.isPublic).map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                             <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                             <div className="flex-1">
                                <p className="text-sm font-black">{item.name}</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">{item.tokenValue} Tokens</p>
                             </div>
                             <M3Chip status={item.status} />
                          </div>
                        ))
                      )}
                   </div>
                </M3Card>
                <M3Card>
                   <h3 className="text-lg font-black tracking-tight uppercase mb-4">Account Stats</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-zinc-500 uppercase">Total Scanned</span>
                         <span className="font-black">{myItems.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-zinc-500 uppercase">Successful Pickups</span>
                         <span className="font-black">{historyItems.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-zinc-500 uppercase">Marketplace Sales</span>
                         <span className="font-black">0</span>
                      </div>
                   </div>
                </M3Card>
             </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-3 animate-in slide-in-from-right-8 duration-300">
             <h3 className="text-xl font-black text-zinc-900 mb-4">Recycling History</h3>
             {historyItems.length === 0 ? (
               <div className="py-20 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">No history yet</div>
             ) : (
               historyItems.map(item => (
                <div key={item.id} className="bg-zinc-50 border border-zinc-100 rounded-[20px] p-4 flex items-center gap-4 opacity-75 grayscale-[0.5]">
                   <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center text-emerald-600 border border-zinc-100">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-sm font-black text-zinc-700">{item.name}</h4>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Points Claimed</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-zinc-900">+{item.estimatedPoints}</p>
                   </div>
                </div>
               ))
             )}
          </div>
        );
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-32">
        {renderContent()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-zinc-100 h-24 flex justify-around items-center px-4 z-40">
        {[
          { id: 'marketplace', label: 'Market', icon: ShoppingBag },
          { id: 'home', label: 'Stats', icon: LayoutDashboard },
          { id: 'items', label: 'Inventory', icon: Package },
          { id: 'profile', label: 'Profile', icon: UserIcon },
          { id: 'history', label: 'History', icon: History }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'home' | 'items' | 'marketplace' | 'history' | 'profile')}
            className="flex flex-col items-center gap-1 group w-16"
          >
            <div className={`h-8 w-12 rounded-full flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-800' : 'text-zinc-400 group-hover:bg-zinc-50'}`}>
              <tab.icon className="w-6 h-6" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {showScanner && <Scanner onClose={() => setShowScanner(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showPickupModal && <PickupRequestModal onClose={() => setShowPickupModal(false)} selectedItems={requestableItems} />}
      </AnimatePresence>
    </div>
  );
};

export const CollectorDashboard: React.FC = () => {
  const { pickups, updatePickupStatus, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'jobs' | 'factory' | 'map'>('jobs');
  const availablePickups = pickups.filter(p => p.status === PickupStatus.PENDING || p.collectorId === currentUser?.id);

  const renderContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-black text-zinc-900">Available Jobs</h3>
            {availablePickups.length === 0 ? (
              <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest text-xs">No pending pickups</div>
            ) : (
              availablePickups.map(pickup => (
                <M3Card key={pickup.id} className="space-y-4">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase">ID: {pickup.id}</p>
                        <h4 className="font-bold text-zinc-900">{pickup.location.address}</h4>
                     </div>
                     <M3Chip status={pickup.status} />
                  </div>
                  <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl">
                     <span className="text-xs font-bold text-zinc-500 uppercase">Reward Pool</span>
                     <span className="font-black text-indigo-600">+{pickup.totalPoints} PTS</span>
                  </div>
                  {pickup.status === PickupStatus.PENDING && (
                    <button 
                      onClick={() => updatePickupStatus(pickup.id, PickupStatus.IN_PROGRESS)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold active:scale-95 transition-all"
                    >
                      Accept Pickup
                    </button>
                  )}
                  {pickup.status === PickupStatus.IN_PROGRESS && (
                    <button 
                      onClick={() => updatePickupStatus(pickup.id, PickupStatus.COMPLETED)}
                      className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold active:scale-95 transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                </M3Card>
              ))
            )}
          </div>
        );
      case 'factory':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-3xl font-black tracking-tighter">Recycling Factory</h2>
                   <p className="text-zinc-500 font-medium">Processing Center #402</p>
                </div>
                <div className="w-16 h-16 bg-zinc-900 text-emerald-400 rounded-[24px] flex items-center justify-center">
                   <Factory className="w-8 h-8" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <M3Card className="bg-zinc-50 border-none">
                   <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Capacity</p>
                   <h4 className="text-2xl font-black">84%</h4>
                   <div className="w-full h-1.5 bg-zinc-200 rounded-full mt-2 overflow-hidden">
                      <div className="w-[84%] h-full bg-emerald-500" />
                   </div>
                </M3Card>
                <M3Card className="bg-zinc-50 border-none">
                   <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Items Processed</p>
                   <h4 className="text-2xl font-black">1,240</h4>
                   <p className="text-[10px] text-emerald-600 font-bold mt-1">+12% this week</p>
                </M3Card>
             </div>

             <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight uppercase">Recent Processing</h3>
                <div className="space-y-3">
                   {[
                     { name: 'Lithium Batteries', weight: '45kg', status: 'Sorted' },
                     { name: 'Circuit Boards', weight: '12kg', status: 'Extracted' },
                     { name: 'Display Glass', weight: '88kg', status: 'Crushed' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100">
                        <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                           <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-black">{item.name}</p>
                           <p className="text-[10px] text-zinc-400 font-bold uppercase">{item.weight}</p>
                        </div>
                        <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[8px] font-black uppercase">{item.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-[600px] rounded-[48px] overflow-hidden border border-zinc-100 shadow-2xl relative">
             <MapSearch />
             <div className="absolute top-6 left-6 right-6 flex gap-3">
                <div className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-zinc-100">
                   <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-emerald-600" />
                      <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase">Route Active</p>
                         <p className="text-sm font-bold">3 Pickups in Queue</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="relative h-full flex flex-col">
       <div className="flex-1 overflow-y-auto pb-32">
          {renderContent()}
       </div>

       <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-zinc-100 h-24 flex justify-around items-center px-4 z-40">
        {[
          { id: 'jobs', label: 'Jobs', icon: Truck },
          { id: 'factory', label: 'Factory', icon: Factory },
          { id: 'map', label: 'Map', icon: Map }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'jobs' | 'factory' | 'map')}
            className="flex flex-col items-center gap-1 group w-16"
          >
            <div className={`h-8 w-12 rounded-full flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-800' : 'text-zinc-400 group-hover:bg-zinc-50'}`}>
              <tab.icon className="w-6 h-6" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
