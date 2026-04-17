/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Instagram, Github } from 'lucide-react';
import SmoothScroll from './components/SmoothScroll';
import HeroScene from './components/canvas/HeroScene';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import { useStore } from './store/useStore';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
const Wechat = lazy(() => import('./pages/Wechat'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Admin = lazy(() => import('./pages/Admin'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Suspense fallback={<div className="min-h-[40vh]" />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/wechat" element={<Wechat />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  const isLoaded = useStore((state) => state.isLoaded);

  // Lock scroll while loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoaded]);

  return (
    <Router>
      <ScrollToTop />
      <Loader />
      <SmoothScroll>
        {/* Global Canvas - Persists across route changes */}
        <HeroScene />
        
        {isLoaded && <Navbar />}

        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-zinc-50 min-h-screen font-sans selection:bg-zinc-800 flex flex-col"
        >
          <div className="flex-grow">
            <AnimatedRoutes />
          </div>

          {/* Footer */}
          <footer className="relative z-10 pt-12 pb-12 pl-6 pr-6 md:px-12 mb-0 border-t border-white/10 bg-zinc-950/50 backdrop-blur-md mt-auto">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative">
              {/* Left: Copyright */}
              <div className="flex-1 flex justify-center md:justify-start text-zinc-400 text-sm font-medium tracking-wide w-full md:w-auto">
                @星烁影视工作室 拥有该网页所有权利
              </div>
              
              {/* Center: Social Icons */}
              <div className="flex items-center justify-center gap-8 text-zinc-400 md:absolute md:left-1/2 md:-translate-x-1/2">
                <a href="#" className="hover:text-zinc-100 transition-colors duration-300 hover:scale-110 transform">
                  <Twitter size={20} strokeWidth={2} />
                </a>
                <a href="#" className="hover:text-zinc-100 transition-colors duration-300 hover:scale-110 transform">
                  <Instagram size={20} strokeWidth={2} />
                </a>
                <a href="#" className="hover:text-zinc-100 transition-colors duration-300 hover:scale-110 transform">
                  <Github size={20} strokeWidth={2} />
                </a>
              </div>

              {/* Right: Links */}
              <div className="flex-1 flex justify-center md:justify-end items-center gap-8 text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] w-full md:w-auto">
                <a href="#" className="hover:text-zinc-100 transition-colors duration-300">隐私政策</a>
                <a href="#" className="hover:text-zinc-100 transition-colors duration-300">使用条款</a>
              </div>
            </div>
          </footer>
        </motion.main>
      </SmoothScroll>
    </Router>
  );
}
