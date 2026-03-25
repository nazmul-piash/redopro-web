import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, EWasteItem, PickupRequest, ItemStatus, PickupStatus } from './types';
import { supabase } from './supabase';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  items: EWasteItem[];
  setItems: React.Dispatch<React.SetStateAction<EWasteItem[]>>;
  pickups: PickupRequest[];
  setPickups: React.Dispatch<React.SetStateAction<PickupRequest[]>>;
  marketplaceItems: EWasteItem[];
  login: (email: string, role: Role) => void;
  signup: (email: string, name: string, role: Role) => void;
  logout: () => void;
  addItem: (item: Omit<EWasteItem, 'id' | 'createdAt' | 'status'>) => void;
  deleteItem: (id: string) => void;
  publishToMarketplace: (id: string, tokenValue: number) => void;
  requestPickup: (itemIds: string[], address: string, lat: number, lng: number) => void;
  updatePickupStatus: (id: string, status: PickupStatus) => void;
}

const MOCK_MARKETPLACE: EWasteItem[] = [
  {
    id: 'm1',
    userId: 'u1',
    name: 'Vintage Macintosh Plus',
    category: 'Computers',
    estimatedPoints: 500,
    tokenValue: 50,
    description: 'A classic piece of computing history. Still boots up!',
    imageUrl: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=800',
    status: ItemStatus.STORED,
    createdAt: new Date().toISOString(),
    isPublic: true,
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' }
  },
  {
    id: 'm2',
    userId: 'u2',
    name: 'Sony Walkman WM-F1',
    category: 'Audio',
    estimatedPoints: 200,
    tokenValue: 20,
    description: 'Original 80s Walkman. Needs new belts.',
    imageUrl: 'https://images.unsplash.com/photo-1611002214172-792c1f90b59a?auto=format&fit=crop&q=80&w=800',
    status: ItemStatus.STORED,
    createdAt: new Date().toISOString(),
    isPublic: true,
    location: { lat: 37.8044, lng: -122.2711, city: 'Oakland' } // Close to SF
  },
  {
    id: 'm3',
    userId: 'u3',
    name: 'Nokia 3310 (Original)',
    category: 'Phones',
    estimatedPoints: 150,
    tokenValue: 15,
    description: 'Indestructible. Battery still holds charge for a week.',
    imageUrl: 'https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?auto=format&fit=crop&q=80&w=800',
    status: ItemStatus.STORED,
    createdAt: new Date().toISOString(),
    isPublic: true,
    location: { lat: 37.3382, lng: -121.8863, city: 'San Jose' } // Within 100km
  },
  {
    id: 'm4',
    userId: 'u4',
    name: 'GameBoy Color (Atomic Purple)',
    category: 'Gaming',
    estimatedPoints: 300,
    tokenValue: 30,
    description: 'Transparent purple shell. Works perfectly.',
    imageUrl: 'https://images.unsplash.com/photo-1531525645387-7f14be13ba73?auto=format&fit=crop&q=80&w=800',
    status: ItemStatus.STORED,
    createdAt: new Date().toISOString(),
    isPublic: true,
    location: { lat: 40.7128, lng: -74.0060, city: 'New York' } // Far away
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('redo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState<EWasteItem[]>(() => {
    const saved = localStorage.getItem('redo_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [pickups, setPickups] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem('redo_pickups');
    return saved ? JSON.parse(saved) : [];
  });

  const [remoteItems, setRemoteItems] = useState<EWasteItem[]>([]);

  const marketplaceItems = [
    ...MOCK_MARKETPLACE,
    ...remoteItems.filter(i => i.isPublic),
    ...items.filter(i => i.isPublic)
  ];

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!itemsError && itemsData) {
          setRemoteItems(itemsData as EWasteItem[]);
        }

        const { data: pickupsData, error: pickupsError } = await supabase
          .from('pickups')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!pickupsError && pickupsData) {
          setPickups(pickupsData as PickupRequest[]);
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('redo_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('redo_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('redo_pickups', JSON.stringify(pickups));
  }, [pickups]);

  const login = (email: string, role: Role) => {
    const name = email.split('@')[0];
    setCurrentUser({ id: Math.random().toString(36).substr(2, 9), email, role, points: 100, name });
  };

  const signup = (email: string, name: string, role: Role) => {
    setCurrentUser({ id: Math.random().toString(36).substr(2, 9), email, role, points: 100, name });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addItem = async (item: Omit<EWasteItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem: EWasteItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: ItemStatus.STORED,
      isPublic: item.isPublic || false,
      location: item.location || undefined
    };

    // Save locally
    setItems(prev => [newItem, ...prev]);

    // Save to Supabase
    if (supabase) {
      try {
        await supabase.from('items').insert([newItem]);
      } catch (err) {
        console.error('Error saving to Supabase:', err);
      }
    }
  };

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    
    if (supabase) {
      try {
        await supabase.from('items').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting from Supabase:', err);
      }
    }
  };

  const publishToMarketplace = async (id: string, tokenValue: number) => {
    const updatedItems = items.map(i => i.id === id ? { 
      ...i, 
      isPublic: true, 
      tokenValue,
      location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' } // Mock location
    } : i);
    
    setItems(updatedItems);

    if (supabase) {
      try {
        await supabase.from('items').update({ 
          isPublic: true, 
          tokenValue,
          location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' }
        }).eq('id', id);
      } catch (err) {
        console.error('Error updating marketplace status in Supabase:', err);
      }
    }
  };

  const requestPickup = async (itemIds: string[], address: string, lat: number, lng: number) => {
    const selectedItems = items.filter(i => itemIds.includes(i.id));
    const totalPoints = selectedItems.reduce((acc, curr) => acc + curr.estimatedPoints, 0);

    const newPickup: PickupRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id || '',
      itemIds,
      status: PickupStatus.PENDING,
      location: { address, lat, lng },
      totalPoints,
      createdAt: new Date().toISOString()
    };

    setPickups(prev => [newPickup, ...prev]);
    setItems(prev => prev.map(i => itemIds.includes(i.id) ? { ...i, status: ItemStatus.PICKUP_REQUESTED } : i));

    if (supabase) {
      try {
        await supabase.from('pickups').insert([newPickup]);
        // Update items status in Supabase too
        for (const itemId of itemIds) {
          await supabase.from('items').update({ status: ItemStatus.PICKUP_REQUESTED }).eq('id', itemId);
        }
      } catch (err) {
        console.error('Error saving pickup to Supabase:', err);
      }
    }
  };

  const updatePickupStatus = async (id: string, status: PickupStatus) => {
    setPickups(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, status, collectorId: status === PickupStatus.IN_PROGRESS ? currentUser?.id : p.collectorId };
        
        // If completed, update items and user points
        if (status === PickupStatus.COMPLETED) {
          setItems(itemsPrev => itemsPrev.map(i => p.itemIds.includes(i.id) ? { ...i, status: ItemStatus.COMPLETED } : i));
          if (currentUser && p.userId === currentUser.id) {
            setCurrentUser({ ...currentUser, points: currentUser.points + p.totalPoints });
          }
        }
        return updated;
      }
      return p;
    }));

    if (supabase) {
      try {
        const updateData: any = { status };
        if (status === PickupStatus.IN_PROGRESS) {
          updateData.collectorId = currentUser?.id;
        }
        await supabase.from('pickups').update(updateData).eq('id', id);

        if (status === PickupStatus.COMPLETED) {
          const pickup = pickups.find(p => p.id === id);
          if (pickup) {
            for (const itemId of pickup.itemIds) {
              await supabase.from('items').update({ status: ItemStatus.COMPLETED }).eq('id', itemId);
            }
          }
        }
      } catch (err) {
        console.error('Error updating pickup status in Supabase:', err);
      }
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, items, setItems, pickups, setPickups, marketplaceItems,
      login, signup, logout, addItem, deleteItem, publishToMarketplace, requestPickup, updatePickupStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
