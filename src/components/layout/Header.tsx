import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, User, LogOut, TicketIcon, Bus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isStaff, isAdmin, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bus className="h-8 w-8 text-blue-800" />
              <span className="ml-2 text-xl font-bold text-blue-800">TransitEase</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/routes" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Routes
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Book a Trip
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Hi, {currentUser?.name.split(' ')[0]}
                </div>
                
                {(isStaff || isAdmin) && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                )}
                
                <Link to="/my-bookings">
                  <TicketIcon className="h-5 w-5 text-gray-600 hover:text-blue-800" />
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-800"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/routes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Routes
            </Link>
            <Link
              to="/booking"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Trip
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                      <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/my-bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    {(isStaff || isAdmin) && (
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;