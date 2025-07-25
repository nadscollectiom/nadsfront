import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { AddCart, removeFromCart, isInCart, generateCartId, getDefaultSize, type Product } from "../route";

interface BannerApiResponse {
  success: boolean;
  data: {
    position: number;
    image_url: string;
    image_path: string;
  };
  message?: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('https://images.pexels.com/photos/1379640/pexels-photo-1379640.jpeg?auto=compress&cs=tinysrgb&w=600'); // fallback image
  const { cart, setCart } = useContext(CartContext);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `sticky-notification bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-600 text-white px-6 py-4 rounded-lg shadow-lg mb-4 max-w-sm`;
    notification.style.cssText = `
      position: relative;
      margin: 16px;
      padding: 16px 24px;
      background-color: ${type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#2563EB'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      pointer-events: auto;
      cursor: pointer;
      animation: slideInRight 0.3s ease;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      z-index: 10000;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 8px; font-size: 16px;">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
          </span>
          <span>${message}</span>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-left: 12px; background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">
          ×
        </button>
      </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 3000);

    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const fetchBackgroundBanner = async () => {
          try {
            const bannerResponse = await fetch(`http://nadscollection.store/app/api/banner/10`);
            const bannerData: BannerApiResponse = await bannerResponse.json();
            
            if (bannerData.success && bannerData.data.image_url) {
              setBackgroundImage(bannerData.data.image_url);
            }
          } catch (bannerError) {
            console.error("Failed to load background banner", bannerError);
          }
        };

        const fetchProducts = async () => {
          const response = await fetch("http://nadscollection.store/app/api/list");
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          let fetchedProducts = data.products?.data || data.products || [];
          
          fetchedProducts = fetchedProducts.map((product: Product) => ({
            ...product,
            id: Number(product.id),
            price: Number(product.price),
            category_id: Number(product.category_id),
            stock: Number(product.stock),
            sizes: product.sizes || ['Small', 'Medium', 'Large']
          }));
          
          setProducts(fetchedProducts);
        };

        await Promise.all([fetchBackgroundBanner(), fetchProducts()]);
        
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCartAction = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sizes = product.sizes || ['Small', 'Medium', 'Large'];
    const defaultSize = getDefaultSize(sizes);
    
    const existingItem = isInCart(cart, product.id, defaultSize);
    
    try {
      if (existingItem) {
        removeFromCart(cart, setCart, existingItem.cartId!);
        showNotification(`${product.title} (${defaultSize}) removed from cart`, "info");
      } else {
        // Add to cart with default size
        const productWithSize: Product = {
          ...product,
          selectedSize: defaultSize,
          sizes: sizes,
          cartId: generateCartId(product.id, defaultSize)
        };
        AddCart(cart, setCart, productWithSize);
        showNotification(`${product.title} (${defaultSize}) added to cart!`, "success");
      }
    } catch (error) {
      console.error("Cart action failed:", error);
      showNotification("Something went wrong. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position: fixed; top: 20px; right: 0; z-index: 9999; pointer-events: none; max-width: 400px;';
      document.body.appendChild(container);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section
        className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      >
        {/* Add a hidden img element to handle errors */}
        <img
          src={backgroundImage}
          alt=""
          className="hidden"
        />
      </section>

      <div className="w-full px-2 sm:px-4 py-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {products.length} products
          </span>
          {/* <div className="flex space-x-4 mt-4 md:mt-0">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <i className="fas fa-th-large" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <i className="fas fa-th-list" />
            </button>
          </div> */}
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => {
              const defaultSize = getDefaultSize(product.sizes);
              const isItemInCart = !!isInCart(cart, product.id, defaultSize);
              
              return (
                <div key={product.id} className="group relative">
                  <Link to={`/item/${product.id}`} state={{ product }}>
                    <div className="w-full overflow-hidden bg-gray-200 aspect-square">
                      <img
                        src={`http://nadscollection.store/app/storage/${product.image}`}
                        alt={product.title}
                        className="h-full w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-75"
                      />
                    </div>
                  </Link>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/item/${product.id}`} state={{ product }}>
                          <span className="absolute inset-0" />
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                  </div>

                  <div className="relative h-8 mt-2">
                    <div className="absolute inset-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleCartAction(e, product)}
                        className="w-full bg-black text-white py-2 text-sm hover:bg-gray-800 transition-colors"
                      >
                        {isItemInCart
                          ? "REMOVE FROM CART"
                          : "ADD TO CART"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold">Cart Summary</h2>
          <p className="text-sm text-gray-700">Items in cart: {cart.length}</p>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .sticky-notification {
          animation: slideInRight 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Shop;  