import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components/route';
import StickyCartNotification from './components/cart/StickyCartNotification';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <StickyCartNotification />
    </div>
  );
};

export default Layout;
