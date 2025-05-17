import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CalendarDays, Shield, Clock, Luggage } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Button from '../components/common/Button';
import StationSelector from '../components/booking/StationSelector';
import DateTimePicker from '../components/booking/DateTimePicker';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    origin,
    destination,
    departureDate,
    departureTime,
    availableStations,
    setOrigin,
    setDestination,
    setDepartureDate,
    setDepartureTime,
  } = useBooking();

  const handleSearch = () => {
    if (origin && destination && departureDate && departureTime) {
      navigate('/booking');
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(1px)'
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Your Journey, Our Priority</h1>
            <p className="text-xl text-blue-100 mb-8">Book comfortable and reliable transport services for your long-distance travels</p>
          </div>
          
          {/* Booking form card */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find Your Route
              </h2>
              <div className="flex space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> Secure Booking
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> 24/7 Support
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              className="mb-6"
            />
            
            <Button
              onClick={handleSearch}
              fullWidth
              size="lg"
              disabled={!origin || !destination || !departureDate || !departureTime}
            >
              Search Routes
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose TransitEase?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Extensive Network</h3>
              <p className="text-gray-600">
                With over 50 stations nationwide, we connect all major cities and destinations for your convenience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Luggage className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Luggage Options</h3>
              <p className="text-gray-600">
                Travel with peace of mind knowing that your luggage, regardless of size, will be handled with care.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Time Departures</h3>
              <p className="text-gray-600">
                We pride ourselves on punctuality, ensuring you reach your destination as scheduled.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular routes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular Routes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress)' }}></div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">New York to Boston</h3>
                  <span className="text-sm text-gray-500">4.5 hours</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Daily departures</span>
                  <span>From $35</span>
                </div>
                <Button variant="outline" fullWidth size="sm">
                  View Schedule
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg?auto=compress)' }}></div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Los Angeles to San Francisco</h3>
                  <span className="text-sm text-gray-500">6 hours</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Daily departures</span>
                  <span>From $45</span>
                </div>
                <Button variant="outline" fullWidth size="sm">
                  View Schedule
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress)' }}></div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Chicago to Detroit</h3>
                  <span className="text-sm text-gray-500">5 hours</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Daily departures</span>
                  <span>From $40</span>
                </div>
                <Button variant="outline" fullWidth size="sm">
                  View Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Passengers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="text-orange-500 text-4xl absolute -top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 pt-3">
                The booking process was incredibly simple, and the staff at the station were very helpful. The bus was clean and comfortable, making my journey pleasant.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">New York to Boston</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="text-orange-500 text-4xl absolute -top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 pt-3">
                I was worried about my oversized luggage, but TransitEase handled it perfectly. The digital ticket system made boarding quick and efficient.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Michael Roberts</h4>
                  <p className="text-sm text-gray-500">Los Angeles to San Francisco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile app promo */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-xl text-blue-100 mb-6">
                Get real-time updates, exclusive offers, and manage your bookings on the go.
              </p>
              <div className="flex space-x-4">
                <Button variant="secondary">
                  App Store
                </Button>
                <Button variant="outline">
                  Google Play
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-96 bg-gray-200 rounded-3xl border-8 border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-700 flex flex-col">
                  <div className="h-10 bg-blue-900 flex items-center justify-center text-sm text-blue-100">
                    TransitEase
                  </div>
                  <div className="flex-1 p-4">
                    <div className="bg-white rounded-lg p-2 mb-3">
                      <div className="h-4 w-3/4 bg-blue-100 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-blue-100 rounded"></div>
                    </div>
                    <div className="bg-white rounded-lg p-2 mb-3">
                      <div className="h-4 w-3/4 bg-blue-100 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-blue-100 rounded"></div>
                    </div>
                    <div className="bg-orange-500 text-white rounded-lg p-2 text-center text-sm">
                      Book Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;