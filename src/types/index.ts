export interface Station {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Bus {
  id: string;
  code: string;
  type: 'standard' | 'luxury';
  totalSeats: number;
  luggageCapacity: number;
  amenities: string[];
  active: boolean;
}

export interface Route {
  id: string;
  name: string;
  origin: Station;
  destination: Station;
  stops: Station[];
  distance: number;
  duration: number;
  busCodes: string[];
}

export interface Seat {
  id: string;
  number: string;
  status: 'available' | 'selected' | 'booked' | 'unavailable';
  price: number;
}

export interface LuggageType {
  id: string;
  name: string;
  maxWeight: number;
  maxSize: string;
  additionalCost: number;
}

export interface Luggage {
  type: LuggageType;
  quantity: number;
  weight?: number;
  description?: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  busCode: string;
  departureDate: string;
  departureTime: string;
  origin: Station;
  destination: Station;
  seats: Seat[];
  luggage: Luggage[];
  totalPrice: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  ticketCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
}

export interface Ticket {
  id: string;
  bookingId: string;
  passengerName: string;
  qrCode: string;
  textCode: string;
  issuedDate: string;
  status: 'valid' | 'used' | 'expired' | 'cancelled';
}