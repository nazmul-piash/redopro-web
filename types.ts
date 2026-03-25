export enum Role {
  USER = 'user',
  COLLECTOR = 'collector',
  ADMIN = 'admin'
}

export enum ItemStatus {
  STORED = 'stored',
  PICKUP_REQUESTED = 'pickup_requested',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum PickupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  points: number;
  name: string;
}

export interface EWasteItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  estimatedPoints: number;
  tokenValue: number;
  description: string;
  imageUrl: string;
  status: ItemStatus;
  createdAt: string;
  isPublic?: boolean;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}

export interface PickupRequest {
  id: string;
  userId: string;
  itemIds: string[];
  status: PickupStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  collectorId?: string;
  totalPoints: number;
  createdAt: string;
}

export interface MarketplaceItem extends EWasteItem {
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  isPublic: boolean;
  tokenValue: number;
}
