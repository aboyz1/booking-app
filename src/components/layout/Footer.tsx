import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Bus } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Bus className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold">TransitEase</span>
            </div>
            <p className="text-gray-300 mb-6">
              Providing comfortable and reliable transport services across the country. Your journey, our priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/routes" className="text-gray-300 hover:text-white transition-colors">Our Routes</a>
              </li>
              <li>
                <a href="/booking" className="text-gray-300 hover:text-white transition-colors">Book a Trip</a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  123 Transport Avenue<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-2" />
                <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-2" />
                <a href="mailto:info@transitease.com" className="text-gray-300 hover:text-white transition-colors">
                  info@transitease.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates and special offers.
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded bg-blue-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TransitEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;