import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 font-sans"> {/* Added font-sans for general text */}
      <div className="text-center max-w-md border border-white/20 bg-black/90 backdrop-blur-sm p-12 rounded-xl shadow-lg">
        <h1 className="text-9xl font-extrabold tracking-tight mb-6 font-serif">404</h1> {/* Added font-serif */}
        <h2 className="text-4xl font-light mb-4 uppercase tracking-widest font-serif">Page Not Found</h2> {/* Added font-serif and increased size slightly */}
        <p className="text-gray-300 mb-8 leading-relaxed"> {/* Added leading-relaxed for better readability */}
          We apologize, the page you are looking for may have been moved, removed, or simply does not exist.
        </p>
        <Link
          to="/"
          className="inline-block border-2 border-white px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 ease-in-out" // Enhanced button style
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;