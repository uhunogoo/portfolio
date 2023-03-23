import React from 'react';

export function useMobileDetection() {
  const [mobileStatus, setMobileStatus] = React.useState( window.innerWidth < 767.5 );

  React.useEffect(() => {
    function handleResize() {
      setMobileStatus( window.innerWidth < 767.5 );
    }
    window.addEventListener( 'resize', handleResize );

    return () => {
      window.removeEventListener( 'resize', handleResize );
    };
  }, []);


  return mobileStatus;
}

