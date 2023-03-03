import React from 'react';
import { throttle } from './utils';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
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

    window.addEventListener('pointermove', onMove);

    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return mousePosition;
}

