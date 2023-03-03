export function support_format_webp() {
  const elem = document.createElement('canvas');

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return (
      elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    );
  } else {
    // very old browser like IE 8, canvas not supported
    return false;
  }
}

/**
 *  Throttle
 */
export function throttle(callback, delay) {
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
}
