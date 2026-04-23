export type BerryType = 'blueberry' | 'lingonberry';

export interface BerryPin {
  id: string;
  lat: number;
  lng: number;
  berryType: BerryType;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePinPayload {
  lat: number;
  lng: number;
  berryType: BerryType;
  notes: string;
}

export interface UpdatePinPayload {
  notes?: string;
  berryType?: BerryType;
}

export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
