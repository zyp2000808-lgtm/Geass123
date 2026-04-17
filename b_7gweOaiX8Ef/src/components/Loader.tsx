import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import gsap from 'gsap';

export default function Loader() {
  const { progress, active, total } = useProgress();
  const setIsLoaded = useStore(state => state.setIsLoaded);
  const isLoaded = useStore(state => state.isLoaded);
  const introState = useStore(state => state.introState);
  const setIntroState = useStore(state => state.setIntroState);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // If no assets to load, force progress to 100
    const targetProgress = (!active && total === 0) ? 100 : progress;
    
    // Smooth out the progress display
    const interval = setInterval(() => {
      setDisplayProgress(p => {
        if (p < targetProgress) return p + 1;
        return p;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [progress, active, total]);

  useEffect(() => {
    // GSAP Timeline Orchestration for the 3D Intro Sequence
    if (displayProgress === 100 && introState === 'loading') {
      const tl = gsap.timeline();
      
      tl.to({}, { duration: 0.6 }) // Brief pause at 100%
        .call(() => setIntroState('hero')) // Directly trigger the Hero transition (sweep and fall)
        .to({}, { duration: 2.8 }) // Shortened from 4.5s - snappier transition
        .call(() => setIsLoaded(true)); // Fade in 2D text and unlock scroll
    }
  }, [displayProgress, introState, setIntroState, setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-zinc-950/20 backdrop-blur-[2px]"
        >
          <div className="relative text-zinc-200 text-sm font-mono tracking-[0.5em] uppercase mix-blend-difference drop-shadow-md flex items-center justify-center">
            {displayProgress < 100 ? (
              `加载中 ${displayProgress}%`
            ) : (
              <div className="relative flex items-center justify-center">
                <span>准备就绪</span>
                <AnimatePresence>
                  {/* Ellipsis stays during 'loading' phase, disappears as soon as the transition starts */}
                  {introState === 'loading' && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-full flex ml-1"
                    >
                      <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0, ease: "easeInOut" }}
                        className="inline-block"
                      >.</motion.span>
                      <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2, ease: "easeInOut" }}
                        className="inline-block"
                      >.</motion.span>
                      <motion.span 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }}
                        className="inline-block"
                      >.</motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
