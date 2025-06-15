export type Product = {
  id: number;
  title: string;
  category_id: number;
  price: number;
  stock: number;
  image?: string;
  category?: {
    id: number;
    name: string;
  };
  sizes?: string[];
  selectedSize?: string; // For cart items with selected size
  cartId?: string; // Unique identifier for cart items with different sizes
};

export const generateCartId = (productId: number, selectedSize?: string): string => {
  const normalizedSize = selectedSize || 'Medium'; // Default to Medium if no size provided
  return `${productId}-${normalizedSize}`;
};

export const AddCart = (
  cart: Product[],
  setCart: React.Dispatch<React.SetStateAction<Product[]>>,
  product: Product
) => {
  const normalizedSize = product.selectedSize || 'Medium'; // Default to Medium
  const cartId = generateCartId(product.id, normalizedSize);
  
  const alreadyInCart = cart.some((item) => item.cartId === cartId);
  
  if (alreadyInCart) {
    return false; // Return false to indicate item wasn't added
  }

  const normalizedProduct: Product = {
    ...product,
    id: Number(product.id),
    price: Number(product.price),
    category_id: Number(product.category_id),
    stock: Number(product.stock),
    cartId: cartId,
    selectedSize: normalizedSize
  };

  const updatedCart = [...cart, normalizedProduct];
  setCart(updatedCart);
  
  // Store in memory instead of localStorage for artifacts
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
  
  return true; 
};

export const removeFromCart = (
  cart: Product[],
  setCart: React.Dispatch<React.SetStateAction<Product[]>>,
  cartIdOrProduct: string | Product
) => {
  let cartId: string;
  
  if (typeof cartIdOrProduct === 'string') {
    cartId = cartIdOrProduct;
  } else {
    const product = cartIdOrProduct;
    cartId = generateCartId(product.id, product.selectedSize);
  }
  
  const updatedCart = cart.filter((item) => item.cartId !== cartId);
  setCart(updatedCart);
  
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
  
  return updatedCart;
};

export const getCartFromStorage = (): Product[] => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart) as Product[];
      if (Array.isArray(parsedCart)) {
        return parsedCart.map(item => ({
          ...item,
          id: Number(item.id),
          price: Number(item.price),
          category_id: Number(item.category_id),
          stock: Number(item.stock),
          selectedSize: item.selectedSize || 'Medium', // Default to Medium
          cartId: item.cartId || generateCartId(item.id, item.selectedSize || 'Medium')
        }));
      }
    }
    return [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

export const clearCart = (
  setCart: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  setCart([]);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem("cart");
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
};

export const getCartTotal = (cart: Product[]): number => {
  return cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price;
  }, 0);
};

export const getCartItemCount = (cart: Product[]): number => {
  return cart.length;
};

export const isInCart = (cart: Product[], productId: number, selectedSize?: string): Product | undefined => {
  const normalizedSize = selectedSize || 'Medium'; // Default to Medium
  const cartId = generateCartId(productId, normalizedSize);
  return cart.find(item => item.cartId === cartId);
};

export const updateCartStorage = (cart: Product[]) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
};

export const getProductVariantsInCart = (cart: Product[], productId: number): Product[] => {
  return cart.filter(item => item.id === productId);
};

export const removeAllProductVariants = (
  cart: Product[],
  setCart: React.Dispatch<React.SetStateAction<Product[]>>,
  productId: number
) => {
  const updatedCart = cart.filter((item) => item.id !== productId);
  setCart(updatedCart);
  
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
  
  return updatedCart;
};

export const getDefaultSize = (sizes?: string[]): string => {
  if (!sizes || sizes.length === 0) {
    return 'Medium';
  }
  
  if (sizes.includes('Medium')) {
    return 'Medium';
  }
  
  return sizes[0];
};