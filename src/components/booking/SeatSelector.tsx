import React, { useState } from 'react';
import { Seat } from '../../types';
import { Tooltip } from 'react-tooltip';
import Button from '../common/Button';

interface SeatSelectorProps {
  bus: {
    id: string;
    code: string;
    type: 'standard' | 'luxury';
    totalSeats: number;
  };
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatDeselect: (seatId: string) => void;
  className?: string;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({
  bus,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  className = '',
}) => {
  // Initialize all seats
  const [seats, _] = useState<Seat[]>(() => {
    const seatsPerRow = bus.type === 'luxury' ? 3 : 4;
    const rows = Math.ceil(bus.totalSeats / seatsPerRow);
    
    return Array.from({ length: bus.totalSeats }, (_, i) => {
      const seatNumber = (i + 1).toString().padStart(2, '0');
      // Some random seats will be already booked
      const randomStatus = Math.random() > 0.7 ? 'booked' : 'available';
      
      return {
        id: `seat-${seatNumber}`,
        number: seatNumber,
        status: randomStatus,
        // Premium seats (front of bus) are more expensive
        price: i < 10 ? (bus.type === 'luxury' ? 75 : 45) : (bus.type === 'luxury' ? 50 : 30),
      };
    });
  });

  // Mark selected seats
  const allSeats = seats.map(seat => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    return {
      ...seat,
      status: isSelected ? 'selected' : seat.status,
    };
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      onSeatDeselect(seat.id);
    } else {
      onSeatSelect(seat);
    }
  };

  // Calculate the layout based on bus type
  const seatsPerRow = bus.type === 'luxury' ? 3 : 4;
  const rows = Math.ceil(bus.totalSeats / seatsPerRow);
  
  // For luxury buses, seat layout is 1-1-1 (single seats with aisle between)
  // For standard buses, seat layout is 2-2 (pairs with aisle between)
  const getSeatLayout = () => {
    const seatRows = [];
    
    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      
      for (let j = 0; j < seatsPerRow; j++) {
        const seatIndex = i * seatsPerRow + j;
        if (seatIndex < allSeats.length) {
          rowSeats.push(allSeats[seatIndex]);
        }
      }
      
      seatRows.push(rowSeats);
    }
    
    return seatRows;
  };
  
  const seatLayout = getSeatLayout();

  // Get seat status color
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-white';
      case 'selected':
        return 'bg-blue-500 text-white';
      case 'booked':
        return 'bg-gray-300 text-gray-500';
      default:
        return 'bg-white';
    }
  };

  // Get price badge color
  const getPriceBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'selected':
        return 'bg-blue-200 text-blue-800';
      case 'booked':
        return 'bg-gray-200 text-gray-500';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Seats</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-8 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded border border-gray-300 bg-white mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded border border-gray-300 bg-blue-500 mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded border border-gray-300 bg-gray-300 mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          {/* Bus front */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-10 bg-blue-800 rounded-t-lg flex items-center justify-center text-white text-sm">
              Driver
            </div>
          </div>
          
          {/* Seat layout */}
          <div className="space-y-2">
            {seatLayout.map((row, rowIndex) => (
              <div 
                key={`row-${rowIndex}`} 
                className={`flex ${bus.type === 'luxury' ? 'justify-between' : 'justify-center space-x-8'}`}
              >
                {bus.type === 'standard' ? (
                  // Standard bus layout (2-2)
                  <>
                    <div className="flex space-x-2">
                      {row.slice(0, 2).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'booked'}
                          className={`
                            w-12 h-12 rounded-t-lg border border-gray-300 flex flex-col items-center justify-center transition-colors
                            ${getSeatColor(seat.status)}
                            ${seat.status !== 'booked' ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-not-allowed'}
                          `}
                          data-tooltip-id={seat.id}
                          data-tooltip-content={`Seat ${seat.number} - $${seat.price}`}
                        >
                          <span className="text-xs font-semibold">{seat.number}</span>
                          <span className={`text-xs px-1 rounded mt-1 ${getPriceBadgeColor(seat.status)}`}>
                            ${seat.price}
                          </span>
                          <Tooltip id={seat.id} />
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {row.slice(2, 4).map(seat => (
                        seat && (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked'}
                            className={`
                              w-12 h-12 rounded-t-lg border border-gray-300 flex flex-col items-center justify-center transition-colors
                              ${getSeatColor(seat.status)}
                              ${seat.status !== 'booked' ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-not-allowed'}
                            `}
                            data-tooltip-id={seat.id}
                            data-tooltip-content={`Seat ${seat.number} - $${seat.price}`}
                          >
                            <span className="text-xs font-semibold">{seat.number}</span>
                            <span className={`text-xs px-1 rounded mt-1 ${getPriceBadgeColor(seat.status)}`}>
                              ${seat.price}
                            </span>
                            <Tooltip id={seat.id} />
                          </button>
                        )
                      ))}
                    </div>
                  </>
                ) : (
                  // Luxury bus layout (1-1-1)
                  <>
                    {row.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        className={`
                          w-14 h-14 rounded-t-lg border border-gray-300 flex flex-col items-center justify-center transition-colors
                          ${getSeatColor(seat.status)}
                          ${seat.status !== 'booked' ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-not-allowed'}
                        `}
                        data-tooltip-id={seat.id}
                        data-tooltip-content={`Seat ${seat.number} - $${seat.price}`}
                      >
                        <span className="text-xs font-semibold">{seat.number}</span>
                        <span className={`text-xs px-1 rounded mt-1 ${getPriceBadgeColor(seat.status)}`}>
                          ${seat.price}
                        </span>
                        <Tooltip id={seat.id} />
                      </button>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-md font-medium text-blue-800 mb-2">Selected Seats</h4>
          <ul className="space-y-1 mb-2">
            {selectedSeats.map(seat => (
              <li key={seat.id} className="flex justify-between">
                <span>Seat {seat.number}</span>
                <span className="font-medium">${seat.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
            <span>Total:</span>
            <span>${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;