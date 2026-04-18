import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: isMobile ? 0.15 : 0.1, 
        duration: isMobile ? 0.8 : 1.5, 
        smoothWheel: true,
        touchMultiplier: 1.5 // Make touch scrolling feel more responsive
      }}
    >
      {children}
    </ReactLenis>
  );
}
