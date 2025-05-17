import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, Bus, Map, TicketIcon, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import TicketVerification from '../components/dashboard/TicketVerification';
import { bookings, tickets } from '../utils/mockData';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isStaff, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('verification');
  
  // Redirect if not authenticated or not staff/admin
  if (!isAuthenticated || (!isStaff && !isAdmin)) {
    navigate('/login');
    return null;
  }
  
  // Mock function to verify tickets
  const handleVerifyTicket = async (ticketCode: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ticket = tickets.find(t => t.textCode === ticketCode);
    if (!ticket) return null;
    
    const booking = bookings.find(b => b.id === ticket.bookingId);
    if (!booking) return null;
    
    return { ticket, booking };
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-blue-800 text-white">
              <h2 className="text-xl font-semibold">Staff Dashboard</h2>
              <p className="text-blue-100 text-sm">Welcome back, Admin</p>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className={`flex items-center w-full px-4 py-2 rounded-md ${
                      activeTab === 'verification' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <TicketIcon className="h-5 w-5 mr-3" />
                    Ticket Verification
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('buses')}
                    className={`flex items-center w-full px-4 py-2 rounded-md ${
                      activeTab === 'buses' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bus className="h-5 w-5 mr-3" />
                    Buses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex items-center w-full px-4 py-2 rounded-md ${
                      activeTab === 'schedule' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    Schedule
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('routes')}
                    className={`flex items-center w-full px-4 py-2 rounded-md ${
                      activeTab === 'routes' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Map className="h-5 w-5 mr-3" />
                    Routes
                  </button>
                </li>
                {isAdmin && (
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center w-full px-4 py-2 rounded-md ${
                        activeTab === 'settings' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </button>
                  </li>
                )}
              </ul>
              
              <div className="mt-8 pt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'verification' && 'Ticket Verification'}
              {activeTab === 'buses' && 'Bus Management'}
              {activeTab === 'schedule' && 'Schedule Management'}
              {activeTab === 'routes' && 'Route Management'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'verification' && 'Verify passenger tickets and luggage details'}
              {activeTab === 'buses' && 'Manage bus fleet and status'}
              {activeTab === 'schedule' && 'View and update bus schedules'}
              {activeTab === 'routes' && 'Manage route information'}
              {activeTab === 'settings' && 'Configure system settings'}
            </p>
          </div>
          
          {/* Ticket verification tab */}
          {activeTab === 'verification' && (
            <div>
              <TicketVerification onVerify={handleVerifyTicket} />
              
              <div className="mt-8">
                <Card title="Recent Verifications">
                  <div className="text-center py-12 text-gray-500">
                    <p>No recent verifications found.</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          {/* Buses tab */}
          {activeTab === 'buses' && (
            <Card title="Bus Management">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bus Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map(booking => (
                      <tr key={booking.busCode}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{booking.busCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Luxury
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          45 seats
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          
          {/* Schedule tab */}
          {activeTab === 'schedule' && (
            <Card title="Schedule Management">
              <div className="p-8 text-center text-gray-500">
                <p>Schedule management functionality will be implemented in the next version.</p>
              </div>
            </Card>
          )}
          
          {/* Routes tab */}
          {activeTab === 'routes' && (
            <Card title="Route Management">
              <div className="p-8 text-center text-gray-500">
                <p>Route management functionality will be implemented in the next version.</p>
              </div>
            </Card>
          )}
          
          {/* Settings tab (admin only) */}
          {activeTab === 'settings' && isAdmin && (
            <Card title="System Settings">
              <div className="p-8 text-center text-gray-500">
                <p>Settings functionality will be implemented in the next version.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;