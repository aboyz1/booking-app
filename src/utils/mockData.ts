import { Station, Bus, Route, LuggageType, Booking, User, Ticket, Seat } from '../types';

// Mock Stations
export const stations: Station[] = [
  {
    id: '1',
    name: 'Central Bus Terminal',
    city: 'New York',
    address: '123 Main Street, New York, NY',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
  {
    id: '2',
    name: 'Union Station',
    city: 'Los Angeles',
    address: '800 N Alameda St, Los Angeles, CA',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
  {
    id: '3',
    name: 'South Station',
    city: 'Boston',
    address: '700 Atlantic Ave, Boston, MA',
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0589,
    },
  },
  {
    id: '4',
    name: 'Transbay Terminal',
    city: 'San Francisco',
    address: '425 Mission St, San Francisco, CA',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: '5',
    name: 'Union Station',
    city: 'Chicago',
    address: '225 S Canal St, Chicago, IL',
    coordinates: {
      latitude: 41.8781,
      longitude: -87.6298,
    },
  },
];

// Mock Buses
export const buses: Bus[] = [
  {
    id: '1',
    code: 'BUS001',
    type: 'standard',
    totalSeats: 45,
    luggageCapacity: 500,
    amenities: ['Air Conditioning', 'WiFi', 'Restroom'],
    active: true,
  },
  {
    id: '2',
    code: 'BUS002',
    type: 'luxury',
    totalSeats: 30,
    luggageCapacity: 400,
    amenities: ['Air Conditioning', 'WiFi', 'Restroom', 'Power Outlets', 'Entertainment System'],
    active: true,
  },
  {
    id: '3',
    code: 'BUS003',
    type: 'standard',
    totalSeats: 45,
    luggageCapacity: 500,
    amenities: ['Air Conditioning', 'WiFi', 'Restroom'],
    active: true,
  },
  {
    id: '4',
    code: 'BUS004',
    type: 'luxury',
    totalSeats: 30,
    luggageCapacity: 400,
    amenities: ['Air Conditioning', 'WiFi', 'Restroom', 'Power Outlets', 'Entertainment System'],
    active: true,
  },
];

// Mock Routes
export const routes: Route[] = [
  {
    id: '1',
    name: 'NYC to LA Express',
    origin: stations[0],
    destination: stations[1],
    stops: [stations[4]],
    distance: 2800,
    duration: 42,
    busCodes: ['BUS001', 'BUS002'],
  },
  {
    id: '2',
    name: 'NYC to Boston Express',
    origin: stations[0],
    destination: stations[2],
    stops: [],
    distance: 215,
    duration: 4.5,
    busCodes: ['BUS003'],
  },
  {
    id: '3',
    name: 'LA to SF Express',
    origin: stations[1],
    destination: stations[3],
    stops: [],
    distance: 380,
    duration: 6,
    busCodes: ['BUS004'],
  },
];

// Mock Luggage Types
export const luggageTypes: LuggageType[] = [
  {
    id: '1',
    name: 'Small Bag',
    maxWeight: 10,
    maxSize: '45cm x 35cm x 20cm',
    additionalCost: 0,
  },
  {
    id: '2',
    name: 'Medium Suitcase',
    maxWeight: 20,
    maxSize: '65cm x 45cm x 25cm',
    additionalCost: 10,
  },
  {
    id: '3',
    name: 'Large Suitcase',
    maxWeight: 30,
    maxSize: '75cm x 55cm x 30cm',
    additionalCost: 20,
  },
  {
    id: '4',
    name: 'Oversized Item',
    maxWeight: 50,
    maxSize: 'Special dimensions',
    additionalCost: 50,
  },
];

// Generate mock seats for a bus
export const generateSeats = (busType: 'standard' | 'luxury'): Seat[] => {
  const totalSeats = busType === 'standard' ? 45 : 30;
  const basePrice = busType === 'standard' ? 25 : 50;
  
  return Array.from({ length: totalSeats }, (_, i) => {
    const seatNumber = (i + 1).toString().padStart(2, '0');
    // Premium seats are in the front
    const isPremiumSeat = i < 10;
    
    return {
      id: `seat-${seatNumber}`,
      number: seatNumber,
      status: Math.random() > 0.7 ? 'booked' : 'available',
      price: isPremiumSeat ? basePrice * 1.5 : basePrice,
    };
  });
};

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    role: 'customer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-765-4321',
    role: 'customer',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@transport.com',
    phone: '555-999-8888',
    role: 'admin',
  },
  {
    id: '4',
    name: 'Station Worker',
    email: 'worker@transport.com',
    phone: '555-111-2222',
    role: 'staff',
  },
];

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    routeId: '1',
    busCode: 'BUS002',
    departureDate: '2025-06-15',
    departureTime: '08:00',
    origin: stations[0],
    destination: stations[1],
    seats: [
      {
        id: 'seat-05',
        number: '05',
        status: 'booked',
        price: 75,
      },
      {
        id: 'seat-06',
        number: '06',
        status: 'booked',
        price: 75,
      },
    ],
    luggage: [
      {
        type: luggageTypes[1],
        quantity: 2,
        weight: 18,
        description: 'Blue medium suitcase',
        imageUrl: 'https://images.pexels.com/photos/2348005/pexels-photo-2348005.jpeg',
      },
    ],
    totalPrice: 160,
    bookingDate: '2025-05-20',
    status: 'confirmed',
    ticketCode: 'NYC-LA-0615-J5D7',
  },
];

// Mock Tickets
export const tickets: Ticket[] = [
  {
    id: '1',
    bookingId: '1',
    passengerName: 'John Doe',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAJJSURBVO3BQY7cQAwEwSxC//9yro88NSBIM7HXIcyMP6hxUeMixkWNixoXNS5qXNS4qHFR46LGixdS+E4VO1LYVLFTBY8UTqrYkeKTVOxIYVPxhRS+U8UTL35ZxZMUTqo4SWGnipMUdqrYSeGkihMVT6r4TSn+pxoXNS5qXNR48cFS2KniOylsKnakmFQ8SWGTwqbiiRQ2KXZSeFLjosZFjYsaL35ZCjtVnKSwSSGlsKnYSeGJFDYVO1LYVJyksEnh36nGRY2LGhc1XnywFHZSeFLFJoWTKk5S2KliJ4VNFVMKmxQ2KWyq+E4pftPnjBc1Lmpc1Hjxn6liU8UmhU0VOyn8TSkepfCTalzUuKhxUePFD0vhOynsVLFJ4UkVOynsVHGSwkkVJylsqjhJ4TNrXNS4qHFR48UPq+I7pfCkipMUdlJ4IoVNxZMUNhUnKfymGhc1Lmpc1Hjxw1L4TlVsUjip4kSKkyo2KWyq2Elhp4pNxU4Kn1njosZFjYsaL15I4TtVbFL4TlWcSGFTxSaFTQqbiicp7KTwnVL8pBoXNS5qXDTGH/xhKexU8SSFTQo7VTyR4jur+GQ1Lmpc1LiI8cMXUjipYpPCSQpPpHBSxSaFJylsqthU8Z1S/KTnjBc1Lmpc1Hjxw1LYqeJECidVbFLYqeKJFHaq2KSwU8WJFDYp7KSwqeJECt+pxkWNixoXNV78YSlsqthJYafiT1I4qeKTpPCdKn5SjYsaFzUuGn/wB9W4qHFR46LGRY2LGhc1Lmpc1Lio8R+bMcFGDVoJ3AAAAABJRU5ErkJggg==',
    textCode: 'NYC-LA-0615-J5D7',
    issuedDate: '2025-05-20',
    status: 'valid',
  },
];