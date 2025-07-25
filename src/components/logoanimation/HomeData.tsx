import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Banner {
  id: number;
  position: number;
  image: string;
  title: string;
  description: string;
}

interface BannerApiResponse {
  success: boolean;
  data: {
    position: number;
    image_url: string;
    image_path: string;
  };
  message?: string;
}

interface FeaturedProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  features: string[];
}

const HomeData: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<FeaturedProduct | null>(null);
  // const [heroBanner, setHeroBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBanners = async (): Promise<void> => {
      try {
        setLoading(true);
        const bannerPromises = [2, 3, 4].map(async (position): Promise<Banner | null> => {
          const response = await fetch(`http://nadscollection.store/app/api/banner/${position}`);
          const data: BannerApiResponse = await response.json();
          
          if (data.success) {
            return {
              id: position,
              position: data.data.position,
              image: data.data.image_url,
              title: `Collection ${position - 1}`,
              description: `Discover our amazing collection ${position} with premium quality and style`
            };
          }
          return null;
        });
        
        const bannerResults = await Promise.all(bannerPromises);
        const validBanners = bannerResults.filter((banner): banner is Banner => banner !== null);
        setBanners(validBanners);

        const featuredResponse = await fetch(`http://nadscollection.store/app/api/banner/6`);
        const featuredData: BannerApiResponse = await featuredResponse.json();
        
        if (featuredData.success) {
          setFeaturedProduct({
            id: 1,
            title: 'Cashmere Overcoat',
            description: 'Exquisitely tailored from the finest Scottish cashmere, this timeless overcoat embodies sophistication and warmth. Hand-finished details and impeccable construction make this piece a wardrobe essential for the discerning gentleman.',
            price: '$1,299',
            originalPrice: '$1,699',
            image: featuredData.data.image_url,
            features: ['100% Scottish Cashmere', 'Hand-Tailored Construction', 'Silk Lining', 'Lifetime Craftsmanship Guarantee']
          });
        }
        
      } catch (error) {        
        // setHeroBanner({
        //   id: 1,
        //   position: 1,
        //   image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
        //   title: 'CRAFTED Elegance',
        //   description: 'Where timeless sophistication meets contemporary design. Discover pieces that define your unique style.'
        // });

        setBanners([
          { 
            id: 1, 
            position: 1,
            title: 'Summer Elegance', 
            description: 'Discover our refined summer collection crafted with the finest materials', 
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop' 
          },
          { 
            id: 2, 
            position: 2,
            title: 'Timeless Classics', 
            description: 'Sophisticated pieces that transcend seasons and trends', 
            image: '' 
          },
          { 
            id: 3, 
            position: 3,
            title: 'Exclusive Atelier', 
            description: 'Limited edition pieces from our master craftsmen', 
            image: '' 
          }
        ]);

        setFeaturedProduct({
          id: 1,
          title: 'Cashmere Overcoat',
          description: 'Exquisitely tailored from the finest Scottish cashmere, this timeless overcoat embodies sophistication and warmth. Hand-finished details and impeccable construction make this piece a wardrobe essential for the discerning gentleman.',
          price: '$1,299',
          originalPrice: '$1,699',
          image: '',
          features: ['100% Scottish Cashmere', 'Hand-Tailored Construction', 'Silk Lining', 'Lifetime Craftsmanship Guarantee']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = '';
  };

  const handleCollectionClick = (banner: Banner) => {
    navigate(`/collection/${banner.position}`, { 
      state: { 
        banner: banner,
        collectionType: 'banner' 
      } 
    });
  };

  const handleFeaturedProductClick = (product: FeaturedProduct) => {
    navigate(`/collection/5`, { 
      state: { 
        banner: {
          id: 5,
          position: 5,
          image: product.image,
          title: product.title,
          description: product.description
        },
        collectionType: 'banner' 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-neutral-800"></div>
      </div>
    );
  }

  return (
    <main className="pt-10 bg-neutral-50">
      {/* Hero Banner Section */}
      {/* <section className="relative h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img 
          src={heroBanner?.image}
          alt="Fashion Hero"
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-8">
            <h1 className="text-7xl md:text-7xl font-light text-white mb-7 tracking-wider">
              CRAFTED
              <span className="block font-thin italic">Elegance</span>
            </h1>
            <p className="text-xl text-neutral-200 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              {heroBanner?.description || 'Where timeless sophistication meets contemporary design. Discover pieces that define your unique style.'}
            </p>
            <div className="space-x-7">
              <button className="bg-white text-neutral-900 px-12 py-4 text-sm tracking-widest uppercase font-medium hover:bg-neutral-100 transition-all duration-300">
                Explore Collection
              </button>
              <button className="border border-white text-white px-12 py-4 text-sm tracking-widest uppercase font-medium hover:bg-white hover:text-neutral-900 transition-all duration-300">
                Watch Story
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Collections Section - Full Width */}
      <section className="w-full px-6 py-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-20 px-8">
            <div className="inline-block">
              <h2 className="text-6xl md:text-7xl font-extralight text-neutral-900 mb-6 tracking-[-0.02em]">
                Collections
              </h2>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-neutral-600 font-light max-w-3xl mx-auto leading-relaxed">
                Discover our carefully curated collections, where each piece tells a story of 
                <span className="italic"> elegance</span>, <span className="italic">craftsmanship</span>, and 
                <span className="italic"> timeless beauty</span>
              </p>
            </div>
          </div>
          
          {/* Collections Grid - Full Width */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {banners.map((banner: Banner, index: number) => (
              <div 
                key={banner.id} 
                className="group p-8 cursor-pointer relative overflow-hidden"
                onClick={() => handleCollectionClick(banner)}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden mb-6">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
                    onError={handleImageError}
                  />
                  
                  {/* Enhanced Overlay - Optional for visual effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 border-2 border-white/20 scale-95 group-hover:scale-100 group-hover:border-white/40 transition-all duration-700 ease-out"></div>
                  
                  {/* Collection Number - Keep on image */}
                  <div className="absolute top-8 right-8 text-white/60 font-light text-sm tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                {/* Content Below Image */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out text-center">
                  <h3 className="text-3xl lg:text-4xl font-light mb-4 text-gray-800 tracking-wide">
                    {banner.title}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed mb-6 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {banner.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="inline-flex items-center text-gray-800 font-light text-sm tracking-[0.2em] uppercase group-hover:text-yellow-600 transition-all duration-500">
                    <span className="border-b border-gray-400/50 group-hover:border-yellow-600/70 pb-1">
                      Explore Collection
                    </span>
                    <svg 
                      className="w-5 h-5 ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProduct && (
        <section className="bg-white py-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 mx-4 lg:mx-20 items-center gap-8">
            
            <div 
              className="flex justify-center group cursor-pointer"
              onClick={() => handleFeaturedProductClick(featuredProduct)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.title}
                  className="w-[90vh] h-[80vh] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  onError={handleImageError}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="absolute inset-0 border border-white/20 scale-95 group-hover:scale-100 group-hover:border-white/40 transition-all duration-700 ease-out"></div>
              </div>
            </div>

            <div className="flex justify-center">
              <div 
                className="p-6 max-w-xl w-full text-center space-y-4 cursor-pointer group"
                onClick={() => handleFeaturedProductClick(featuredProduct)}
              >
                <h2 className="text-3xl font-semibold text-neutral-800 group-hover:text-yellow-600 transition-colors duration-500">
                  {featuredProduct.title}
                </h2>
                <p className="text-base text-neutral-600 mx-auto max-w-md group-hover:text-neutral-700 transition-colors duration-500">
                  {featuredProduct.description}
                </p>
                
                <div className="inline-flex items-center text-neutral-800 font-light text-sm tracking-[0.2em] uppercase group-hover:text-yellow-600 transition-all duration-500 mt-6">
                  <span className="border-b border-neutral-400/50 group-hover:border-yellow-600/70 pb-1">
                    View Product
                  </span>
                  <svg 
                    className="w-5 h-5 ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
};

export default HomeData;