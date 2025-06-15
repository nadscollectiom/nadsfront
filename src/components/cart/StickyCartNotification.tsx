import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const StickyCartNotification = () => {
  const { cartItemCount } = useContext(CartContext); 
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cartItemCount > 0) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [cartItemCount]);

  const handleShopNow = () => {
    navigate('/order'); 
  };

  const handleHide = () => {
    setIsVisible(false);
  };

  if (!isVisible || cartItemCount === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:block">
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
            isAnimating ? 'animate-bounce' : ''
          }`}
        >
          <div className="bg-black text-white rounded-full shadow-2xl flex items-center space-x-4 px-6 py-4 min-w-[280px] hover:bg-gray-800 transition-colors duration-300">
            <div className="relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.39a1 1 0 01-.986.61H3M7 13v-2a4 4 0 018 0v2m-8 0h8"
                />
              </svg>
              
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-xs text-gray-300">Ready to checkout</p>
            </div>

            <button
              onClick={handleShopNow}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              View Cart
            </button>

            <button
              onClick={handleHide}
              className="text-gray-400 hover:text-white transition-colors duration-200 ml-2"
              aria-label="Hide cart notification"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white shadow-2xl border-t border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.39a1 1 0 01-.986.61H3M7 13v-2a4 4 0 018 0v2m-8 0h8"
                    />
                  </svg>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                  </p>
                  <p className="text-xs text-gray-300">in your cart</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleHide}
                  className="text-gray-400 hover:text-white p-2"
                  aria-label="Hide cart notification"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={handleShopNow}
                  className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyCartNotification;