import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Mail } from 'lucide-react';
import TicketView from '../components/ticket/TicketView';
import Button from '../components/common/Button';
import { bookings, tickets } from '../utils/mockData';

const TicketConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticketCode } = location.state || { ticketCode: 'NYC-LA-0615-J5D7' }; // Default for demo
  
  // In a real app, we would fetch the booking and ticket from an API
  // For this demo, we'll use mock data
  const ticket = tickets.find(t => t.textCode === ticketCode) || tickets[0];
  const booking = bookings.find(b => b.id === ticket.bookingId) || bookings[0];
  
  const handleDownload = () => {
    // In a real app, we would generate a PDF ticket
    alert('Ticket download feature would be implemented here!');
  };
  
  const handleEmailTicket = () => {
    // In a real app, we would send an email with the ticket
    alert('Ticket would be emailed to the registered email address!');
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been successfully confirmed. Your ticket details are below.
          </p>
        </div>
        
        <TicketView
          booking={booking}
          ticketCode={ticket.textCode}
          qrCode={ticket.qrCode}
          onDownload={handleDownload}
          className="mb-8"
        />
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={handleEmailTicket} variant="outline">
            <Mail className="h-4 w-4 mr-2" /> Email Ticket
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download Ticket
          </Button>
          <Button onClick={() => alert('Share feature would be implemented here!')} variant="outline">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Information</h3>
          <ul className="space-y-2 text-blue-700">
            <li>Please arrive at the station at least 30 minutes before departure.</li>
            <li>Have your ticket and ID ready for verification at the station.</li>
            <li>Luggage exceeding the weight limit may incur additional charges.</li>
            <li>Check-in closes 15 minutes before departure.</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Button onClick={handleReturnHome} variant="secondary">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmationPage;