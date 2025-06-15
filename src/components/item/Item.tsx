import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { AddCart, removeFromCart, isInCart, generateCartId, getDefaultSize, type Product } from "../route";
import { Link } from "react-router-dom";

// Type definitions for banner data
interface Banner {
  id: number;
  position: number;
  image: string;
  title: string;
  description: string;
  price?: number;
  sizes?: string[];
}

interface BannerApiResponse {
  success: boolean;
  data: {
    position: number;
    image_url: string;
    image_path: string;
    price?: number;
    sizes?: string[];
  };
  message?: string;
}

interface ExtendedProduct extends Product {
  sizes?: string[];
}

const Item = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { cart, setCart } = useContext(CartContext);
  const [product, setProduct] = useState<ExtendedProduct | null>(location.state?.product || null);
  const [banner, setBanner] = useState<Banner | null>(location.state?.banner || null);
  const [collectionType, setCollectionType] = useState<string>(location.state?.collectionType || 'product');
  const [selectedSize, setSelectedSize] = useState<string>('Medium');
  const [availableSizes, setAvailableSizes] = useState<string[]>(['Small', 'Medium', 'Large']);
  const [loading, setLoading] = useState(!product && !banner);
  const [error, setError] = useState<string | null>(null);
  
  // New state for product suggestions
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // Function to show sticky notification
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

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 4000);

    // Remove on click
    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });
  };

  // Function to fetch suggested products using Math.random()
  const fetchSuggestedProducts = async () => {
    try {
      setSuggestionsLoading(true);
      const response = await fetch("http://localhost:8000/api/list");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let allProducts = data.products?.data || data.products || [];
      
      // Filter out current product if it exists
      if (product && product.id) {
        allProducts = allProducts.filter((p: Product) => p.id !== product.id);
      }
      
      // Use Math.random() to shuffle and select random products
      const shuffled = allProducts.sort(() => Math.random() - 0.5);
      const randomProducts = shuffled.slice(0, 4); // Get 4 random products
      
      // Format products
      const formattedProducts = randomProducts.map((prod: Product) => ({
        ...prod,
        id: Number(prod.id),
        price: Number(prod.price),
        category_id: Number(prod.category_id),
        stock: Number(prod.stock),
        sizes: prod.sizes || ['Small', 'Medium', 'Large']
      }));
      
      setSuggestedProducts(formattedProducts);
    } catch (error) {
      console.error("Failed to fetch suggested products:", error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSuggestedProductCart = (e: React.MouseEvent, suggestedProduct: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sizes = suggestedProduct.sizes || ['Small', 'Medium', 'Large'];
    const defaultSize = getDefaultSize(sizes);
    
    const existingItem = isInCart(cart, suggestedProduct.id, defaultSize);
    
    try {
      if (existingItem) {
        removeFromCart(cart, setCart, existingItem.cartId!);
        showNotification(`${suggestedProduct.title} (${defaultSize}) removed from cart`, "info");
      } else {
        const productWithSize: Product = {
          ...suggestedProduct,
          selectedSize: defaultSize,
          sizes: sizes,
          cartId: generateCartId(suggestedProduct.id, defaultSize)
        };
        AddCart(cart, setCart, productWithSize);
        showNotification(`${suggestedProduct.title} (${defaultSize}) added to cart!`, "success");
      }
    } catch (error) {
      console.error("Cart action failed:", error);
      showNotification("Something went wrong. Please try again.", "error");
    }
  };

  useEffect(() => {
    let sizes: string[] = [];
    
    if (product?.sizes && product.sizes.length > 0) {
      sizes = product.sizes;
    } else if (banner?.sizes && banner.sizes.length > 0) {
      sizes = banner.sizes;
    } else {
      sizes = ['Small', 'Medium', 'Large'];
    }
    
    setAvailableSizes(sizes);
    
    if (sizes.includes('Medium')) {
      setSelectedSize('Medium');
    } else if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize('Medium'); 
    }
  }, [product, banner]);

  useEffect(() => {
    const isCollection = location.state?.collectionType === 'banner' || location.pathname.includes('/collection/');
    if (isCollection && !banner && id) {
      const fetchBanner = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/banner/${id}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: BannerApiResponse = await response.json();
          
          if (data.success) {
            setBanner({
              id: parseInt(id),
              position: data.data.position,
              image: data.data.image_url,
              title: `Collection ${id}`,
              description: `Discover our amazing collection ${id} with premium quality and style`,
              price: data.data.price || 99.99,
              sizes: data.data.sizes || ['Small', 'Medium', 'Large']
            });
            setCollectionType('banner');
          } else {
            throw new Error('Banner not found');
          }
        } catch (err) {
          setError("Collection not found");
          setTimeout(() => navigate("/"), 2000);
        } finally {
          setLoading(false);
        }
      };

      fetchBanner();
    } else if (!isCollection && !product && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/products/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const productData = data.product || data;          
          if (productData.sizes && typeof productData.sizes === 'string') {
            try {
              productData.sizes = JSON.parse(productData.sizes);
            } catch {
              productData.sizes = [productData.sizes];
            }
          }
          
          setProduct(productData);
          setCollectionType('product');
        } catch (err) {
          setError("Product not found");
          setTimeout(() => navigate("/"), 2000);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    } else if (product || banner) {
      setLoading(false);
    }
  }, [id, product, banner, navigate, location.state]);

  // Fetch suggested products when component loads
  useEffect(() => {
    if (!loading && (product || banner)) {
      fetchSuggestedProducts();
    }
  }, [loading, product, banner]);

  const handleAddToCart = (item: ExtendedProduct | Banner) => {
    
    if (!selectedSize) {
      showNotification("Please select a size", "error");
      return;
    }

    const productItem: Product = {
      id: item.id,
      title: item.title,
      price: typeof item.price === 'number' ? item.price : 99.99,
      category_id: 0,
      stock: 999,
      image: item.image || '',
      selectedSize: selectedSize,
      sizes: availableSizes,
      category: 'category' in item ? item.category : { id: 0, name: 'Collection' },
      cartId: generateCartId(item.id, selectedSize)
    };

    const existingItem = isInCart(cart, item.id, selectedSize);

    try {
      if (existingItem) {
        removeFromCart(cart, setCart, existingItem.cartId!);
        showNotification(`${item.title} (${selectedSize}) removed from cart`, "info");
      } else {
        AddCart(cart, setCart, productItem);
        showNotification(`${item.title} (${selectedSize}) added to cart!`, "success");
      }
    } catch (error) {
      showNotification("Something went wrong. Please try again.", "error");
    }
  };
  
  const SizeSelector = ({ sizes, selectedSize, onSizeChange }: {
    sizes: string[];
    selectedSize: string;
    onSizeChange: (size: string) => void;
  }) => (
    <div className="mb-8">
      <p className="text-gray-700 mb-4">SIZE</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => {
              onSizeChange(size);
            }}
            className={`px-4 py-2 border transition-colors ${
              size === selectedSize
                ? 'bg-black text-white border-black'
                : 'border-gray-300 hover:border-black hover:bg-gray-50'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {selectedSize && (
        <p className="text-sm text-gray-600 mt-2">
          Selected: <span className="font-medium">{selectedSize}</span>
        </p>
      )}
    </div>
  );

  // Suggested Products Component
  const SuggestedProducts = () => (
    <div className="container mx-auto px-6 py-16 border-t border-gray-200">
      <h2 className="text-2xl font-medium mb-8 text-center">You Might Also Like</h2>
      
      {suggestionsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading suggestions...</div>
        </div>
      ) : suggestedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedProducts.map((suggestedProduct) => {
            const defaultSize = getDefaultSize(suggestedProduct.sizes);
            const isItemInCart = !!isInCart(cart, suggestedProduct.id, defaultSize);
            
            return (
              <div key={suggestedProduct.id} className="group relative">
                <Link to={`/item/${suggestedProduct.id}`} state={{ product: suggestedProduct }}>
                  <div className="w-full overflow-hidden bg-gray-200 aspect-square">
                    <img
                      src={
                        suggestedProduct.image
                          ? `http://localhost:8000/storage/${suggestedProduct.image}`
                          : "https://via.placeholder.com/300"
                      }
                      alt={suggestedProduct.title}
                      className="h-full w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-75"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300";
                      }}
                    />
                  </div>
                </Link>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/item/${suggestedProduct.id}`} state={{ product: suggestedProduct }}>
                        <span className="absolute inset-0" />
                        {suggestedProduct.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {suggestedProduct.category?.name || "Uncategorized"}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${suggestedProduct.price}</p>
                </div>

                <div className="relative h-8 mt-2">
                  <div className="absolute inset-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleSuggestedProductCart(e, suggestedProduct)}
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No suggestions available at the moment.</p>
        </div>
      )}
    </div>
  );

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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || (!product && !banner)) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">{error || "Content not found. Redirecting..."}</p>
      </div>
    );
  }

  if (collectionType === 'banner' && banner) {
    const existingCartItem = isInCart(cart, banner.id, selectedSize);
    const isItemInCart = !!existingCartItem;

    return (
      <div className="bg-white pt-10 text-gray-900">
        <div id="backdrop" className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div>

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-gray-800">Home</a> / 
              <span className="text-gray-800"> {banner.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="product-visual h-96 md:h-[500px] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={banner.image}
                    alt={banner.title} 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/500";
                    }}
                  />
                </div>
              </div>

              <div className="lg:w-1/2 pt-6">
                <h1 className="text-3xl md:text-4xl font-medium mb-4">{banner.title}</h1>
                <div className="flex items-center mb-6">
                </div>

                <div className="text-2xl font-medium mb-8">${banner.price || 99.99}</div>

                <div className="mb-8">
                  <span className="inline-block bg-gray-100 px-3 py-1 text-sm text-gray-700 rounded">
                    Collection
                  </span>
                </div>

                <SizeSelector 
                  sizes={availableSizes}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />

                <button
                  onClick={() => {
                    handleAddToCart(banner);
                  }}
                  disabled={!selectedSize}
                  className={`btn w-full py-4 mb-4 transition hover:translate-y-[-2px] ${
                    selectedSize 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isItemInCart ? "REMOVE FROM CART" : "ADD TO CART"}
                  {selectedSize && ` (${selectedSize})`}
                </button>

                <button
                  onClick={() => navigate('/shop', { state: { collection: banner.position } })}
                  className="btn w-full py-4 mb-6 transition hover:translate-y-[-2px] bg-gray-100 text-black hover:bg-gray-200 border border-gray-300"
                >
                  EXPLORE COLLECTION
                </button>

                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-medium mb-4">Description</h3>
                  <p className="text-gray-700 mb-6">
                    {banner.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Collection Details</h3>
                  <p className="text-gray-700 mb-4">
                    Explore our curated collection featuring premium quality items and exclusive designs.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Available sizes: {availableSizes.join(', ')}
                  </p>
                  <a href="#" className="text-sm underline hover:text-gray-600">View all items</a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Suggested Products Section */}
        <SuggestedProducts />

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
  }

  if (collectionType === 'product' && product) {
    const existingCartItem = isInCart(cart, product.id, selectedSize);
    const isItemInCart = !!existingCartItem;
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    return (
      <div className="bg-white pt-10 text-gray-900">
        <div id="backdrop" className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div>

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-gray-800">Home</a> / 
              <a href="/shop" className="hover:text-gray-800"> Shop</a> / 
              <span className="text-gray-800"> {product.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="product-visual h-120 md:h-[500px] flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={
                      product.image 
                        ? `http://localhost:8000/storage/${product.image}`
                        : "https://via.placeholder.com/500"
                    }
                    alt={product.title} 
                    className="h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/500";
                    }}
                  />
                </div>
              </div>

              <div className="lg:w-1/2 pt-6">
                <h1 className="text-3xl md:text-4xl font-medium mb-4">{product.title}</h1>
                <div className="flex items-center mb-6">
                </div>
                <div className="text-2xl font-medium mb-8">${product.price}</div>

                {product.category && (
                  <div className="mb-6">
                    <span className="inline-block bg-gray-100 px-3 py-1 text-sm text-gray-700 rounded">
                      {product.category.name}
                    </span>
                  </div>
                )}

                <SizeSelector 
                  sizes={availableSizes}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />

                {product.stock !== undefined && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      {product.stock > 0 ? (
                        <span className="text-green-600">
                          ✓ In stock ({product.stock} available)
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ✗ Out of stock
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                  disabled={!selectedSize || isOutOfStock}
                  className={`btn w-full py-4 mb-6 transition hover:translate-y-[-2px] ${
                    selectedSize && !isOutOfStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isItemInCart ? "REMOVE FROM CART" : "ADD TO CART"}
                  {selectedSize && ` (${selectedSize})`}
                </button>

                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-medium mb-4">Description</h3>
                  <p className="text-gray-700 mb-6">
                    Premium quality product with excellent craftsmanship and attention to detail. Perfect for everyday use and special occasions.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Product Details</h3>
                  <div className="text-gray-700 mb-4">
                    <p className="mb-2">Available sizes: {availableSizes.join(', ')}</p>
                    {product.category && (
                      <p className="mb-2">Category: {product.category.name}</p>
                    )}
                    <p>Complimentary shipping and returns on all orders. Delivery within 3-5 business days.</p>
                  </div>
                  <a href="#" className="text-sm underline hover:text-gray-600">View size guide</a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Suggested Products Section */}
        <SuggestedProducts />

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
  }

  return null;
};

export default Item;