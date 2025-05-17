import React from 'react';
import { Bus, CalendarDays, Clock, MapPin, User, Luggage } from 'lucide-react';
import { Booking, Seat, Luggage as LuggageType } from '../../types';
import Button from '../common/Button';

interface TicketViewProps {
  booking: Booking;
  ticketCode: string;
  qrCode: string;
  onDownload?: () => void;
  className?: string;
}

const TicketView: React.FC<TicketViewProps> = ({
  booking,
  ticketCode,
  qrCode,
  onDownload,
  className = '',
}) => {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="relative overflow-hidden bg-white border-4 border-blue-800 rounded-lg shadow-lg">
        {/* Top pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
        
        {/* Ticket top */}
        <div className="px-6 py-5 bg-blue-800 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bus className="h-8 w-8 mr-2" />
              <div>
                <h2 className="text-2xl font-bold">TransitEase</h2>
                <p className="text-blue-100">E-Ticket Confirmation</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Booking Ref</div>
              <div className="text-xl font-mono">{booking.id.substring(0, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>
        
        {/* Ticket body */}
        <div className="p-6">
          {/* Route information */}
          <div className="flex flex-col md:flex-row mb-6 justify-between">
            <div className="flex flex-1 items-start">
              <div className="min-w-10 mr-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-800"></div>
                  <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">From</div>
                  <div className="text-lg font-semibold">{booking.origin.name}</div>
                  <div className="text-sm text-gray-700">{booking.origin.city}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">To</div>
                  <div className="text-lg font-semibold">{booking.destination.name}</div>
                  <div className="text-sm text-gray-700">{booking.destination.city}</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-6 md:mt-0 md:border-l md:border-r border-gray-200 md:px-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <CalendarDays className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Date</span>
                  </div>
                  <div className="font-medium">{new Date(booking.departureDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Time</span>
                  </div>
                  <div className="font-medium">{booking.departureTime}</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Bus className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Bus</span>
                  </div>
                  <div className="font-medium">{booking.busCode}</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Platform</span>
                  </div>
                  <div className="font-medium">A{Math.floor(Math.random() * 10) + 1}</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-6 md:mt-0 flex justify-center items-center">
              <div className="text-center">
                <img src={qrCode} alt="QR Code" className="w-32 h-32 mx-auto mb-2" />
                <div className="font-mono text-sm font-medium">{ticketCode}</div>
              </div>
            </div>
          </div>
          
          {/* Passenger & seat info */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-full md:w-1/3 mb-3 md:mb-0">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">Passenger</span>
                </div>
                <div className="font-medium">John Doe</div>
              </div>
              <div className="px-2 w-full md:w-1/3 mb-3 md:mb-0">
                <div className="flex items-center mb-1">
                  <span className="text-sm text-gray-500">Seat Numbers</span>
                </div>
                <div className="font-medium">
                  {booking.seats.map((seat: Seat) => seat.number).join(', ')}
                </div>
              </div>
              <div className="px-2 w-full md:w-1/3">
                <div className="flex items-center mb-1">
                  <span className="text-sm text-gray-500">Total Fare</span>
                </div>
                <div className="font-medium text-lg">${booking.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* Luggage info */}
          {booking.luggage.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                <Luggage className="h-4 w-4 text-gray-500 mr-1" />
                Luggage Details
              </h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <ul className="space-y-2">
                  {booking.luggage.map((item: LuggageType, index: number) => (
                    <li key={index} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.type.name}</span> x {item.quantity}
                        {item.weight && <span className="ml-2 text-gray-600">({item.weight}kg)</span>}
                        {item.description && <span className="ml-2 text-gray-600">- {item.description}</span>}
                      </div>
                      <div className="text-gray-700">${item.type.additionalCost.toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Ticket footer */}
        <div className="p-4 text-center text-sm text-gray-600 border-t border-dashed border-gray-300">
          <p>Please arrive at least 30 minutes before departure time. Show this ticket at the station counter.</p>
        </div>
      </div>
      
      {onDownload && (
        <div className="mt-4 text-center">
          <Button onClick={onDownload} variant="secondary">
            Download Ticket
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketView;