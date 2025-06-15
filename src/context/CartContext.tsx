import React, { createContext, useState, useEffect } from "react";
import type { Product } from "../components/route";
import { getCartFromStorage, updateCartStorage } from "../components/route";

type CartContextType = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  cartItemCount: number;
  isCartVisible: boolean;
  setIsCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  cartItemCount: 0,
  isCartVisible: false,
  setIsCartVisible: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => getCartFromStorage());
  const [isCartVisible, setIsCartVisible] = useState(false);

  const cartItemCount = cart.length;

  useEffect(() => {
    updateCartStorage(cart);
    
    if (cartItemCount > 0) {
      setIsCartVisible(true);
    }
  }, [cart, cartItemCount]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      setCart, 
      cartItemCount, 
      isCartVisible, 
      setIsCartVisible 
    }}>
      {children}
    </CartContext.Provider>
  );
};

