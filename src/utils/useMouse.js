import { useEffect, useState } from 'react'


export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const transformValue = (value) => (value - 0.5) * 2;

        // Use throttle function for perfomance
        const onMove = throttle((e) => {
            const screenHeight = window.innerHeight;
            const screenWidth = window.innerWidth;

            setMousePosition({
                x: transformValue(e.clientX / screenWidth),
                y: 1 - transformValue(e.clientY / screenHeight)
            });
        }, 40);

        window.addEventListener('pointermove', onMove);

        return () => {
            window.removeEventListener('pointermove', onMove);
        }
    }, []);

    return mousePosition;
}

// THROTTLE
function throttle( callback, delay ) {
    let throttleTimeout = null;
    let storedEvent = null;
    const throttledEventHandler = (event) => {
        storedEvent = event;
        const shouldHandleEvent = !throttleTimeout;
        if (shouldHandleEvent) {
            callback(storedEvent);
            storedEvent = null;
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;

                if (storedEvent) {
                    throttledEventHandler(storedEvent);
                }
            }, delay);
        }
    };

    return throttledEventHandler;
};

