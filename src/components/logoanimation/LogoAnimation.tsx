import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, HomeData } from '../route';

const LogoAnimation = () => {
  const mainLogoRef = useRef<HTMLHeadingElement>(null);
  const navLogoRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const scrollAnimationIdRef = useRef<number | null>(null);
  
  // State for banner image
  const [bannerImage, setBannerImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('http://localhost:8000/api/banner/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
                
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.image_url) {
          setBannerImage(result.data.image_url);
        } else if (result.data && result.data.image_path) {
          const imageUrl = `http://localhost:8000/storage/${result.data.image_path}`;
          setBannerImage(imageUrl);
        } else {
          throw new Error('No image URL found in response');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (!mainLogoRef.current || !navLogoRef.current || !navbarRef.current) return;

      const mainLogo = mainLogoRef.current;
      const navLogo = navLogoRef.current;
      const navbar = navbarRef.current;
      const body = document.body;
      const navLogoRect = navLogo.getBoundingClientRect();
      const mainLogoRect = mainLogo.getBoundingClientRect();
      const scaleFactor = navLogoRect.width / mainLogoRect.width;
      const targetX = navLogoRect.left - (window.innerWidth / 2 - navLogoRect.width / 2);
      const targetY = navLogoRect.top - (window.innerHeight / 2 - navLogoRect.height / 2);
      const startScroll = 10;
      const maxScroll = 200;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max((scrollY - startScroll) / (maxScroll - startScroll), 0), 1);
      const easedProgress = easeOutCubic(progress);

      if (progress > 0 && progress < 1) {
        mainLogo.style.transform = `
          translate(calc(0% + ${targetX * easedProgress}px), calc(-50% + ${targetY * easedProgress}px))
          scale(${1 - (1 - scaleFactor) * easedProgress})
        `;
        navLogo.style.opacity = `${easedProgress}`;
        mainLogo.style.opacity = `${1 - easedProgress * 0.8}`; 
        navbar.style.opacity = `${easedProgress}`;
        navbar.style.pointerEvents = 'auto';
      } else if (progress >= 1) {
        body.classList.add('logo-in-nav');
        mainLogo.style.opacity = '0';
        navLogo.style.opacity = '1';
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'auto';
      } else {
        body.classList.remove('logo-in-nav');
        mainLogo.style.transform = 'translate(-0%, -50%) scale(1)';
        mainLogo.style.opacity = '1';
        navLogo.style.opacity = '0';
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
      }
    };

    const easeOutCubic = (t: number) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const handleResize = () => {
      handleScroll(); 
    };

    const throttledScroll = () => {
      if (!scrollAnimationIdRef.current) {
        scrollAnimationIdRef.current = requestAnimationFrame(() => {
          handleScroll();
          scrollAnimationIdRef.current = null;
        });
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollAnimationIdRef.current) {
        cancelAnimationFrame(scrollAnimationIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <Link to="/shop" className="block">
        <section 
          className="relative h-screen bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: bannerImage ? `url('${bannerImage}')` : 'none',
            backgroundColor: isLoading ? '#f3f4f6' : 'transparent'
          }}
        >
          {/* Loading State */}
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-50">
    <div
      className="flex space-x-3 text-6xl font-bold text-gray-900 text-center"
      style={{ fontFamily: "'Cinzel Decorative'" }}
    >
      {["N", "A", "D","'", "S"].map((char, index) => (
        <span
          key={index}
          className="will-change-transform animate-fade-wave"
          style={{ 
            animationDelay: `${index * 0.15}s`, 
            animationDuration: '1.5s' 
          }}
        >
          {char}
        </span>
      ))}
    </div>
  </div>
)}
          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-red-500 text-xl mb-2">Failed to load banner</div>
                <div className="text-gray-600">Using fallback image</div>
              </div>
            </div>
          )}

          <h1 
            ref={mainLogoRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl text-white font-bold z-10 transition-all duration-500 will-change-transform"
              style={{ fontFamily: "'Cinzel Decorative'" }}

          >
            N&nbsp;&nbsp;A&nbsp;&nbsp;D&nbsp;'&nbsp;S
          </h1>

         
                <div 
        ref={navbarRef} 
        className="fixed top-0 left-0 w-full h-20 bg-white/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100 opacity-0 pointer-events-none flex items-center justify-center transition-opacity duration-500"
      >
        <Header/>
        <div 
          ref={navLogoRef}
          className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-center justify-center w-40 opacity-0 transition-opacity duration-500"
        >
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold tracking-wider">NADS</div>
          </Link>
        </div>
      </div>

        </section>
      </Link>


      <HomeData />
    </>
  );
};

export default LogoAnimation;