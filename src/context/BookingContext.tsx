import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Station, Route, Bus, Seat, LuggageType, Luggage } from '../types';
import { stations, routes, buses, luggageTypes } from '../utils/mockData';

interface BookingContextType {
  // Current booking state
  origin: Station | null;
  destination: Station | null;
  departureDate: string | null;
  departureTime: string | null;
  selectedBus: Bus | null;
  selectedRoute: Route | null;
  selectedSeats: Seat[];
  luggage: Luggage[];
  luggageImage: string | null;
  
  // All available data
  availableStations: Station[];
  availableRoutes: Route[];
  availableBuses: Bus[];
  availableLuggageTypes: LuggageType[];
  
  // Actions
  setOrigin: (station: Station | null) => void;
  setDestination: (station: Station | null) => void;
  setDepartureDate: (date: string | null) => void;
  setDepartureTime: (time: string | null) => void;
  setSelectedBus: (bus: Bus | null) => void;
  setSelectedRoute: (route: Route | null) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  addLuggage: (luggage: Luggage) => void;
  removeLuggage: (index: number) => void;
  setLuggageImage: (imageUrl: string | null) => void;
  resetBooking: () => void;
  completeBooking: () => string; // Returns ticket code
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for current booking
  const [origin, setOrigin] = useState<Station | null>(null);
  const [destination, setDestination] = useState<Station | null>(null);
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [luggage, setLuggage] = useState<Luggage[]>([]);
  const [luggageImage, setLuggageImage] = useState<string | null>(null);

  // Available data from mock API
  const availableStations = stations;
  const availableRoutes = routes;
  const availableBuses = buses;
  const availableLuggageTypes = luggageTypes;

  // Seat actions
  const addSeat = (seat: Seat) => {
    setSelectedSeats((prev) => [...prev, { ...seat, status: 'selected' }]);
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId));
  };

  // Luggage actions
  const addLuggage = (newLuggage: Luggage) => {
    setLuggage((prev) => [...prev, newLuggage]);
  };

  const removeLuggage = (index: number) => {
    setLuggage((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset all booking data
  const resetBooking = () => {
    setOrigin(null);
    setDestination(null);
    setDepartureDate(null);
    setDepartureTime(null);
    setSelectedBus(null);
    setSelectedRoute(null);
    setSelectedSeats([]);
    setLuggage([]);
    setLuggageImage(null);
  };

  // Complete booking and generate ticket code
  const completeBooking = () => {
    if (!origin || !destination || !departureDate) {
      throw new Error('Incomplete booking details');
    }
    
    // Generate a unique ticket code
    const originCode = origin.city.substring(0, 3).toUpperCase();
    const destCode = destination.city.substring(0, 3).toUpperCase();
    const dateCode = departureDate.replace(/-/g, '').substring(4, 8);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const ticketCode = `${originCode}-${destCode}-${dateCode}-${randomStr}`;
    
    // In a real app, this would call an API to save the booking
    
    return ticketCode;
  };

  const value = {
    // Current booking state
    origin,
    destination,
    departureDate,
    departureTime,
    selectedBus,
    selectedRoute,
    selectedSeats,
    luggage,
    luggageImage,
    
    // All available data
    availableStations,
    availableRoutes,
    availableBuses,
    availableLuggageTypes,
    
    // Actions
    setOrigin,
    setDestination,
    setDepartureDate,
    setDepartureTime,
    setSelectedBus,
    setSelectedRoute,
    addSeat,
    removeSeat,
    addLuggage,
    removeLuggage,
    setLuggageImage,
    resetBooking,
    completeBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};