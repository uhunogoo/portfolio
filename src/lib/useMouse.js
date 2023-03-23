import gsap from 'gsap';
import React from 'react';
import { useMobileDetection } from './useMobileDetection';
import { throttle } from './utils';

export function useMousePosition() {
  const mobileStatus = useMobileDetection();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (mobileStatus) return;
    function transformValue(value) {
      return (value - 0.5) * 2;
    }

    // Use throttle function for perfomance
    const onMove = throttle((e) => {
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      setMousePosition({
        x: transformValue(e.clientX / screenWidth),
        y: transformValue(e.clientY / screenHeight),
      });
    }, 40);

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [ mobileStatus ]);
  React.useEffect(() => {
    if (!mobileStatus) return;
    if (!window.DeviceOrientationEvent) return;

    function transformValue(value) {
      return (value - 0.5) * 2;
    }

    const handleOrientation = throttle(({ gamma, beta }) => {
      const leftToRight = gamma ? gsap.utils.clamp(-45, 45, gamma ) : 0;
      const frontToBack = beta ? gsap.utils.clamp(10, 55, beta ) : 0;

      setMousePosition({
        x: transformValue((leftToRight / 45) * 2),
        y: transformValue((frontToBack / 45) * 2),
      });
    }, 80);

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [ mobileStatus ]);

  return mousePosition;
}



