import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bus, Calendar, MapPin, CreditCard, PackageCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from '../components/common/Button';
import StationSelector from '../components/booking/StationSelector';
import DateTimePicker from '../components/booking/DateTimePicker';
import SeatSelector from '../components/booking/SeatSelector';
import LuggageSelector from '../components/booking/LuggageSelector';
import Card from '../components/common/Card';

type BookingStep = 'route' | 'bus' | 'seats' | 'luggage' | 'payment';

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('route');
  const navigate = useNavigate();
  
  const {
    origin,
    destination,
    departureDate,
    departureTime,
    selectedBus,
    selectedRoute,
    selectedSeats,
    luggage,
    luggageImage,
    availableStations,
    availableRoutes,
    availableBuses,
    availableLuggageTypes,
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
    completeBooking,
  } = useBooking();

  // Find available routes based on origin and destination
  const filteredRoutes = availableRoutes.filter(
    route => route.origin.id === origin?.id && route.destination.id === destination?.id
  );

  // Find available buses for the selected route
  const filteredBuses = selectedRoute 
    ? availableBuses.filter(bus => selectedRoute.busCodes.includes(bus.code))
    : [];

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    // Add luggage costs
    luggage.forEach(item => {
      total += item.type.additionalCost * item.quantity;
    });
    
    return total;
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'route':
        setCurrentStep('bus');
        break;
      case 'bus':
        setCurrentStep('seats');
        break;
      case 'seats':
        setCurrentStep('luggage');
        break;
      case 'luggage':
        setCurrentStep('payment');
        break;
      case 'payment':
        // Complete booking and get ticket code
        const ticketCode = completeBooking();
        navigate('/booking/confirmation', { state: { ticketCode } });
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case 'bus':
        setCurrentStep('route');
        break;
      case 'seats':
        setCurrentStep('bus');
        break;
      case 'luggage':
        setCurrentStep('seats');
        break;
      case 'payment':
        setCurrentStep('luggage');
        break;
    }
  };

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 'route':
        return origin && destination && departureDate && departureTime && filteredRoutes.length > 0;
      case 'bus':
        return selectedRoute && selectedBus;
      case 'seats':
        return selectedSeats.length > 0;
      case 'luggage':
        return true; // Luggage is optional
      case 'payment':
        return true; // We'll assume payment info is valid
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Booking steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-800 h-2.5 rounded-full transition-all duration-300"
              style={{ 
                width: 
                  currentStep === 'route' ? '20%' :
                  currentStep === 'bus' ? '40%' :
                  currentStep === 'seats' ? '60%' :
                  currentStep === 'luggage' ? '80%' : '100%'
              }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className={`text-sm ${currentStep === 'route' ? 'text-blue-800 font-medium' : 'text-gray-500'}`}>
            Route
          </div>
          <div className={`text-sm ${currentStep === 'bus' ? 'text-blue-800 font-medium' : 'text-gray-500'}`}>
            Bus
          </div>
          <div className={`text-sm ${currentStep === 'seats' ? 'text-blue-800 font-medium' : 'text-gray-500'}`}>
            Seats
          </div>
          <div className={`text-sm ${currentStep === 'luggage' ? 'text-blue-800 font-medium' : 'text-gray-500'}`}>
            Luggage
          </div>
          <div className={`text-sm ${currentStep === 'payment' ? 'text-blue-800 font-medium' : 'text-gray-500'}`}>
            Payment
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Route selection */}
          {currentStep === 'route' && (
            <Card title="Select Your Route">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StationSelector
                    label="From"
                    stations={availableStations}
                    selectedStation={origin}
                    onSelect={setOrigin}
                    excludeStation={destination}
                  />
                  
                  <StationSelector
                    label="To"
                    stations={availableStations}
                    selectedStation={destination}
                    onSelect={setDestination}
                    excludeStation={origin}
                  />
                </div>
                
                <DateTimePicker
                  selectedDate={departureDate}
                  selectedTime={departureTime}
                  onDateChange={setDepartureDate}
                  onTimeChange={setDepartureTime}
                />
                
                {origin && destination && departureDate && departureTime && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Available Routes</h3>
                    
                    {filteredRoutes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No routes available for this selection. Please try different stations or dates.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredRoutes.map((route) => (
                          <div 
                            key={route.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedRoute?.id === route.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedRoute(route)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{route.name}</h4>
                              <span className="text-sm text-gray-500">{route.duration} hours</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex flex-col items-center mr-4">
                                <div className="w-3 h-3 rounded-full bg-blue-800"></div>
                                <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <div className="text-sm">{route.origin.name}</div>
                                  <div className="text-sm">{departureTime}</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-sm">{route.destination.name}</div>
                                  <div className="text-sm">
                                    {/* Estimate arrival time */}
                                    {(() => {
                                      if (!departureTime) return '';
                                      const [hours, minutes] = departureTime.split(':').map(Number);
                                      const durationHours = Math.floor(route.duration);
                                      const durationMinutes = Math.round((route.duration - durationHours) * 60);
                                      
                                      let newHours = hours + durationHours;
                                      let newMinutes = minutes + durationMinutes;
                                      
                                      if (newMinutes >= 60) {
                                        newHours += 1;
                                        newMinutes -= 60;
                                      }
                                      
                                      // Check if we go to the next day
                                      const nextDay = newHours >= 24;
                                      if (nextDay) {
                                        newHours -= 24;
                                      }
                                      
                                      return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}${nextDay ? ' (+1)' : ''}`;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {route.stops.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                Stops: {route.stops.map(stop => stop.name).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {/* Bus selection */}
          {currentStep === 'bus' && (
            <Card title="Select Your Bus">
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-700 mr-2" />
                    <div>
                      <span className="font-medium">{origin?.name}</span> to <span className="font-medium">{destination?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-700 mr-2" />
                    <div>
                      {new Date(departureDate!).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} at {departureTime}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredBuses.map((bus) => (
                    <div 
                      key={bus.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedBus?.id === bus.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedBus(bus)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Bus className="h-5 w-5 text-blue-800 mr-2" />
                          <h4 className="font-medium">{bus.code}</h4>
                        </div>
                        <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">{bus.type}</span>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">{bus.totalSeats}</span> seats • 
                        <span className="font-medium ml-1">{bus.luggageCapacity}</span> kg luggage capacity
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((amenity, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-right">
                        <span className="font-semibold text-blue-800">
                          {bus.type === 'luxury' ? 'From $50' : 'From $30'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
          
          {/* Seat selection */}
          {currentStep === 'seats' && selectedBus && (
            <Card title="Select Your Seats">
              <SeatSelector
                bus={selectedBus}
                selectedSeats={selectedSeats}
                onSeatSelect={addSeat}
                onSeatDeselect={removeSeat}
              />
            </Card>
          )}
          
          {/* Luggage selection */}
          {currentStep === 'luggage' && (
            <Card title="Luggage Information">
              <LuggageSelector
                luggageTypes={availableLuggageTypes}
                selectedLuggage={luggage}
                onAddLuggage={addLuggage}
                onRemoveLuggage={removeLuggage}
                onUploadImage={setLuggageImage}
              />
              
              {luggageImage && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Uploaded Luggage Image</h4>
                  <div className="border rounded-md p-2">
                    <img src={luggageImage} alt="Luggage" className="w-full max-h-60 object-contain rounded" />
                    <div className="mt-2 p-3 bg-blue-50 text-sm text-blue-800 rounded">
                      <strong>Analysis:</strong> Medium-sized suitcase detected. Additional fee: $10.
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {/* Payment information */}
          {currentStep === 'payment' && (
            <Card title="Payment Information">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your Trip Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-medium">{origin?.name}, {origin?.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-medium">{destination?.name}, {destination?.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date & Time</div>
                      <div className="font-medium">
                        {new Date(departureDate!).toLocaleDateString()} at {departureTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bus</div>
                      <div className="font-medium">{selectedBus?.code} ({selectedBus?.type})</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Seats</div>
                      <div className="font-medium">
                        {selectedSeats.map(seat => seat.number).join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Passengers</div>
                      <div className="font-medium">{selectedSeats.length}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 border-blue-500 bg-blue-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="credit-card"
                          name="payment-method"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked
                          readOnly
                        />
                        <label htmlFor="credit-card" className="ml-3 block">
                          <span className="font-medium">Credit/Debit Card</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paypal"
                          name="payment-method"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled
                        />
                        <label htmlFor="paypal" className="ml-3 block text-gray-500">
                          <span className="font-medium">PayPal</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        placeholder="123"
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              onClick={handlePrevStep}
              variant="outline"
              disabled={currentStep === 'route'}
            >
              Back
            </Button>
            
            <Button
              onClick={handleNextStep}
              disabled={!isStepComplete()}
            >
              {currentStep === 'payment' ? 'Complete Booking' : 'Continue'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Booking summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold border-b pb-3 mb-4">Booking Summary</h3>
            
            {/* Route info */}
            {origin && destination && (
              <div className="mb-4">
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-gray-600 text-sm">From</div>
                    <div className="font-medium">{origin.name}, {origin.city}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div className="text-gray-600 text-sm">To</div>
                    <div className="font-medium">{destination.name}, {destination.city}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Date info */}
            {departureDate && departureTime && (
              <div className="mb-4 flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <div className="text-gray-600 text-sm">Departure</div>
                  <div className="font-medium">
                    {new Date(departureDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {' '}at {departureTime}
                  </div>
                </div>
              </div>
            )}
            
            {/* Bus info */}
            {selectedBus && (
              <div className="mb-4 flex items-start">
                <Bus className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <div className="text-gray-600 text-sm">Bus</div>
                  <div className="font-medium">
                    {selectedBus.code} ({selectedBus.type})
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedBus.amenities.join(' • ')}
                  </div>
                </div>
              </div>
            )}
            
            {/* Seats info */}
            {selectedSeats.length > 0 && (
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Selected Seats</div>
                <div className="font-medium flex flex-wrap gap-1">
                  {selectedSeats.map(seat => (
                    <span key={seat.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                      Seat {seat.number}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Luggage info */}
            {luggage.length > 0 && (
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Luggage</div>
                <ul className="space-y-1">
                  {luggage.map((item, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>{item.type.name} x {item.quantity}</span>
                      <span>${(item.type.additionalCost * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Price breakdown */}
            {selectedSeats.length > 0 && (
              <div className="mb-4 border-t pt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Seat fare</span>
                  <span className="font-medium">${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}</span>
                </div>
                
                {luggage.length > 0 && (
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Luggage fee</span>
                    <span className="font-medium">
                      ${luggage.reduce((sum, item) => sum + item.type.additionalCost * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">$2.50</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-blue-800">${(calculateTotalPrice() + 2.50).toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              By proceeding with this booking, you agree to our terms and conditions and cancellation policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;