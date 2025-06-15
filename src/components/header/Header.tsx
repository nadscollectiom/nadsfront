import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { cart } = useContext(CartContext);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Function to handle sidebar link clicks
  const handleSidebarLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-25 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto h-full flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline-block text-gray-800 font-medium">Menu</span>
              <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-800 focus:outline-none">
                ☰
              </button>
            </div>

            <Link to="/shop" className="hidden md:block text-gray-800 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-center justify-center w-40">
            <div
              id="nav-logo"
              className="text-xl font-bold tracking-wider text-center"
              style={{ fontFamily: "'Cinzel Decorative'" }}
            >
              NAD'S 
              <br />
              COLLECTION
            </div>
          </Link>

          {/* Right Side - Contact and Cart */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon - Always visible */}
            <Link to="/order" className="text-gray-800 hover:text-gray-600 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            </Link>

            {/* Contact - Hidden on mobile */}
            <Link to="/contacts" className="hidden md:inline-block text-gray-800 hover:text-gray-600 font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 pt-24 px-8 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-6 left-6 text-3xl text-gray-800 focus:outline-none">
          ✕
        </button>

        {/* Sidebar Links */}
        <div className="space-y-8">
          <Link 
            to="/" 
            onClick={handleSidebarLinkClick}
            className="block text-2xl text-gray-800 border-b border-gray-100 pb-4 hover:text-gray-600 transition"
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            onClick={handleSidebarLinkClick}
            className="block text-2xl text-gray-800 border-b border-gray-100 pb-4 hover:text-gray-600 transition"
          >
            Shop
          </Link>
          <Link 
            to="/shop" 
            onClick={handleSidebarLinkClick}
            className="block text-2xl text-gray-800 border-b border-gray-100 pb-4 hover:text-gray-600 transition"
          >
            Collections
          </Link>
          <div 
            onClick={handleSidebarLinkClick}
            className="block text-2xl text-gray-400 border-b border-gray-100 pb-4 cursor-not-allowed"
          >
            About
          </div>
          <Link 
            to="/contacts" 
            onClick={handleSidebarLinkClick}
            className="block text-2xl text-gray-800 border-b border-gray-100 pb-4 hover:text-gray-600 transition"
          >
            Contact
          </Link>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-gray-500 text-sm">NADS COLLECTIONS</p>
        </div>
      </div>
    </>
  );
};

export default Header;