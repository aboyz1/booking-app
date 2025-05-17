import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { Booking, Ticket } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface TicketVerificationProps {
  onVerify: (ticketCode: string) => Promise<{booking: Booking, ticket: Ticket} | null>;
  className?: string;
}

const TicketVerification: React.FC<TicketVerificationProps> = ({
  onVerify,
  className = '',
}) => {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    booking: Booking;
    ticket: Ticket;
    status: 'valid' | 'invalid' | 'used';
  } | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleVerify = async () => {
    if (!ticketCode.trim()) return;
    
    setLoading(true);
    try {
      const result = await onVerify(ticketCode);
      
      if (result) {
        // Simulate verification status
        const status = Math.random() > 0.8 ? 'used' : 'valid';
        
        setVerificationResult({
          booking: result.booking,
          ticket: result.ticket,
          status: status as 'valid' | 'invalid' | 'used',
        });
      } else {
        setVerificationResult({
          booking: {} as Booking,
          ticket: {} as Ticket,
          status: 'invalid',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        booking: {} as Booking,
        ticket: {} as Ticket,
        status: 'invalid',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    // In a real app, this would activate a QR scanner
    // For demo purposes, we'll simulate finding a ticket after a delay
    setShowScanner(true);
    setLoading(true);
    
    setTimeout(() => {
      // Simulate finding a QR code for the NYC-LA-0615-J5D7 ticket
      setTicketCode('NYC-LA-0615-J5D7');
      setLoading(false);
      setShowScanner(false);
      
      // Auto-verify after "scanning"
      handleVerify();
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'used':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'invalid':
      case 'used':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Ticket is valid! Passenger can proceed.';
      case 'invalid':
        return 'Invalid ticket. Please check the code and try again.';
      case 'used':
        return 'This ticket has already been used.';
      default:
        return '';
    }
  };

  return (
    <div className={`${className}`}>
      <Card title="Ticket Verification">
        <div className="space-y-6">
          {/* Ticket input */}
          <div>
            <div className="flex mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter ticket code"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={!ticketCode.trim() || loading}
                className="ml-2"
              >
                Verify
              </Button>
              <Button
                onClick={handleScanQR}
                variant="outline"
                className="ml-2"
                disabled={loading || showScanner}
              >
                <Camera className="h-4 w-4 mr-1" /> Scan
              </Button>
            </div>
            
            {/* QR Scanner simulation */}
            {showScanner && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-48 h-48 border-2 border-dashed border-blue-500 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-blue-500 opacity-50" />
                  </div>
                  <p className="mt-3 text-gray-600">Scanning QR code...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Verification result */}
          {verificationResult && (
            <div className={`border rounded-md p-4 ${getStatusColor(verificationResult.status)}`}>
              <div className="flex items-center mb-3">
                {getStatusIcon(verificationResult.status)}
                <h3 className="text-lg font-medium ml-2">
                  {verificationResult.status === 'valid' ? 'Ticket Verified' : 'Verification Failed'}
                </h3>
              </div>
              
              <p className="mb-4">{getStatusMessage(verificationResult.status)}</p>
              
              {verificationResult.status === 'valid' && (
                <div className="bg-white rounded-md p-3 border border-green-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Passenger</div>
                      <div className="font-medium">John Doe</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bus Code</div>
                      <div className="font-medium">{verificationResult.booking.busCode}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-medium">{verificationResult.booking.origin.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-medium">{verificationResult.booking.destination.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Departure</div>
                      <div className="font-medium">
                        {new Date(verificationResult.booking.departureDate).toLocaleDateString()} at {verificationResult.booking.departureTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Seats</div>
                      <div className="font-medium">
                        {verificationResult.booking.seats.map(s => s.number).join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Luggage details */}
                  {verificationResult.booking.luggage && verificationResult.booking.luggage.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm text-gray-500 mb-1">Luggage</div>
                      <ul className="space-y-1">
                        {verificationResult.booking.luggage.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.type.name} x {item.quantity}
                            {item.description && <span className="text-gray-600"> - {item.description}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TicketVerification;