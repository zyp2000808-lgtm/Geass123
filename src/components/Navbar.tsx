import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: '首页', path: '/' },
  { name: '作品', path: '/projects' },
  { name: '关于', path: '/about' },
  { name: '联系', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 px-fluid-container py-6 flex justify-between items-center mix-blend-difference text-zinc-100 pointer-events-none"
      >
        <Link to="/" className="flex items-center gap-2 md:gap-3 pointer-events-auto group" aria-label="RAD Studio 首页">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 md:w-9 md:h-9 text-zinc-100 transition-transform duration-700 ease-in-out group-hover:rotate-180"
          >
            <path d="M50 5L93.3 30V70L50 95L6.7 70V30L50 5Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
            <path d="M50 5V50M93.3 30L50 50M6.7 30L50 50M50 50V95" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
          <span className="hidden md:block text-lg md:text-xl font-bold tracking-tighter uppercase mt-0.5">
            星烁影视工作室
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`relative text-sm font-medium tracking-wide uppercase outline-none
                  after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-zinc-100 after:origin-left after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)]
                  ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100'}
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden pointer-events-auto p-2 -mr-2 outline-none group"
          aria-label="打开菜单"
        >
          <div className="flex flex-col gap-1.5 items-end">
            <span className="w-8 h-[2px] bg-zinc-100 transition-transform duration-300 group-hover:scale-x-75 origin-right"></span>
            <span className="w-5 h-[2px] bg-zinc-100 transition-transform duration-300 group-hover:scale-x-125 origin-right"></span>
            <span className="w-8 h-[2px] bg-zinc-100 transition-transform duration-300 group-hover:scale-x-75 origin-right"></span>
          </div>
        </button>
      </motion.nav>

      {/* Mobile Navigation Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-2xl flex flex-col p-fluid-container"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center py-6">
              <span className="text-xl font-bold tracking-tighter uppercase text-zinc-100">菜单</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 outline-none group"
                aria-label="关闭菜单"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <span className="absolute w-8 h-[2px] bg-zinc-100 rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]"></span>
                  <span className="absolute w-8 h-[2px] bg-zinc-100 -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]"></span>
                </div>
              </button>
            </div>

            {/* Modal Links */}
            <div className="flex-1 flex flex-col justify-center gap-8">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  >
                    <Link 
                      to={link.path}
                      className={`text-5xl font-bold tracking-tighter uppercase transition-colors
                        ${isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="py-12 border-t border-white/10"
            >
              <p className="text-zinc-500 text-sm font-mono tracking-widest uppercase mb-4">联系我</p>
              <a href="mailto:zyp2000808@gmail.com" className="text-2xl font-medium text-zinc-100">zyp2000808@gmail.com</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
