import { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext'; 
import type { Product } from '../route';
export type OrderProduct = Product; 

interface OrderItem extends OrderProduct {
}

interface FormData {
  name: string;
  email: string;
  contact: string;
  address?: string;
  message: string;
  orders: OrderItem[];
}

const Order = () => {
  const { cart, setCart } = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const orders = cart;

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "https:";
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `http://localhost:8000/storage/${imageUrl}`;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as Record<string, string>;
      
      const submitData: FormData = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address || "",
        message: data.message,
        orders: orders 
      };

      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        setSubmitMessage("Your order has been received. We'll contact you shortly.");        
        
        setCart([]);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("cart");
        }
        
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setSubmitMessage(`Unable to process your order: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (order: OrderItem) => {
    const updatedOrders = orders.filter((item) => 
      item.cartId !== order.cartId && 
      !(item.id === order.id && item.selectedSize === order.selectedSize)
    );
    
    setCart(updatedOrders);
  };

  const totalPrice = orders.reduce((sum, order) => {
    const price = Number(order.price) || 0;
    return sum + price;
  }, 0);

  return (
    <div className="min-h-screen pt-12 bg-neutral-50">
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4 tracking-wide">
              Shopping Bag
            </h1>
            <div className="w-24 h-px bg-neutral-900"></div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200">
              <div className="mb-8">
                <svg className="w-16 h-16 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-2xl font-light text-neutral-700 mb-3">Your bag is empty</h3>
                <p className="text-neutral-500 font-light">Discover our latest collections</p>
              </div>
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-6 mb-8">
                {orders.map((order: OrderItem) => (
                  <div key={order.cartId || order.id} className="bg-white border border-neutral-200 p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(order.image)}
                          alt={order.title}
                          className="h-32 w-24 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-light text-lg text-neutral-900 leading-tight">{order.title}</h3>
                          <button
                            onClick={() => handleRemoveItem(order)}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-sm text-neutral-600">
                          <p>Category: {order.category?.name || 'N/A'}</p>
                          <p>Size: {order.selectedSize || 'One Size'}</p>
                          <p>Stock: {Number(order.stock) || 0} available</p>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <span className="text-lg font-light text-neutral-900">
                            ${(Number(order.price) || 0).toFixed(2)}
                          </span>
                          <span className="text-xs text-neutral-400 uppercase tracking-wider">
                            #{order.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-neutral-900 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-neutral-300 text-sm font-light uppercase tracking-wider mb-1">Subtotal</p>
                      <p className="text-2xl font-light">${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-300 text-sm font-light uppercase tracking-wider mb-1">Items</p>
                      <p className="text-xl font-light">{orders.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="bg-white border border-neutral-200">
                  <table className="w-full">
                    <thead className="border-b border-neutral-200">
                      <tr>
                        <th className="px-8 py-6 text-left text-xs font-medium text-neutral-500 uppercase tracking-widest">Product</th>
                        <th className="px-8 py-6 text-left text-xs font-medium text-neutral-500 uppercase tracking-widest">Details</th>
                        <th className="px-8 py-6 text-left text-xs font-medium text-neutral-500 uppercase tracking-widest">Price</th>
                        <th className="px-8 py-6 text-left text-xs font-medium text-neutral-500 uppercase tracking-widest">Stock</th>
                        <th className="px-8 py-6 text-center text-xs font-medium text-neutral-500 uppercase tracking-widest">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.map((order: OrderItem) => (
                        <tr className="hover:bg-neutral-50 transition-colors duration-200" key={order.cartId || order.id}>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-6">
                              <img
                                src={getImageUrl(order.image)}
                                alt={order.title}
                                className="h-24 w-20 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
                                }}
                              />
                              <div>
                                <h3 className="font-light text-neutral-900 text-lg mb-1">{order.title}</h3>
                                <p className="text-sm text-neutral-500 uppercase tracking-wider">#{order.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <div className="space-y-2 text-sm text-neutral-600">
                              <p>{order.category?.name || 'N/A'}</p>
                              <p className="font-medium">Size: {order.selectedSize || 'One Size'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <span className="text-xl font-light text-neutral-900">${(Number(order.price) || 0).toFixed(2)}</span>
                          </td>
                          <td className="px-8 py-8">
                            <span className="text-neutral-600">{Number(order.stock) || 0} available</span>
                          </td>
                          <td className="px-8 py-8 text-center">
                            <button
                              onClick={() => handleRemoveItem(order)}
                              className="text-neutral-400 hover:text-neutral-700 transition-colors p-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Desktop Total */}
                  <div className="border-t border-neutral-200 bg-neutral-50">
                    <div className="px-8 py-8 flex justify-end">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Subtotal ({orders.length} {orders.length === 1 ? 'item' : 'items'})</p>
                        <p className="text-3xl font-light text-neutral-900">${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 tracking-wide">
              Complete Your Order
            </h2>
            <div className="w-24 h-px bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-neutral-600 font-light text-lg max-w-2xl mx-auto">
              Please provide your details below and we'll contact you to finalize your order and arrange delivery.
            </p>
          </div>

          {submitMessage && (
            <div className={`mb-8 p-6 border ${
              submitMessage.includes('received') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-light">{submitMessage}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  disabled={isSubmitting}
                  className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors disabled:opacity-50" 
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  disabled={isSubmitting}
                  className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors disabled:opacity-50" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Phone Number *
              </label>
              <input 
                type="tel" 
                id="contact" 
                name="contact" 
                required 
                disabled={isSubmitting}
                placeholder="+1 (555) 123-4567"
                className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors disabled:opacity-50" 
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Delivery Address
              </label>
              <textarea 
                id="address" 
                name="address" 
                rows={3} 
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors resize-none disabled:opacity-50"
              ></textarea>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Message *
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors resize-none disabled:opacity-50"
              ></textarea>
            </div>

            <div className="pt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting || orders.length === 0}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-light px-12 py-4 uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing Order...' : `Place Order • $${totalPrice.toFixed(2)}`}
              </button>
              
              {orders.length === 0 && (
                <p className="text-neutral-500 text-sm mt-4 font-light">
                  Add items to your bag to proceed
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Order;