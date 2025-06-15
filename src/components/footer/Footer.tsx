import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const socialLinks = [
  { icon: <Facebook className="w-6 h-6" />, url: 'https://facebook.com' },
  { icon: <Instagram className="w-6 h-6" />, url: 'https://instagram.com/nadscollections' },
  { icon: <MessageCircle className="w-6 h-6"/>, url: 'https://wa.me/+923207418826' },
];

function SocialSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold tracking-wide uppercase text-gray-300">Stay Connected</h3>
      <div>
        <h4 className="text-gray-300 mb-4">Follow Us</h4>
        <div className="flex space-x-6">
          {socialLinks.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition duration-300 text-xl"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo / About */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tighter">NADS</h2>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              Bringing you premium quality products that combine sophisticated design with exceptional function. Discover something extraordinary today.
            </p>
            <div className="pt-4">
              <a
                href="#"
                className="inline-block border-b border-gray-500 text-gray-300 hover:text-white hover:border-white transition duration-300"
              >
                Learn more about us
              </a>
            </div>
          </div>


          {/* Newsletter & Social Icons */}
          {SocialSection()}
        </div>

        {/* Branding Banner */}
        <div className="mt-24 overflow-hidden">
          <div className="flex justify-center">
            <h1 className="text-[15vw] font-bold leading-none tracking-wider text-gray-900 relative z-0 inline-block">
              <span
  style={{ fontFamily: "'Cinzel Decorative'" }}
                className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-800 mix-blend-difference"
                
              >
                N&nbsp;&nbsp;A&nbsp;&nbsp;D&nbsp;&nbsp;S
              </span>
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
