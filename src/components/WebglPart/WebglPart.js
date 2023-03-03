import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LoadingProgressContext } from '../LoadingProvider/LoadingProvider';
const UseResources = React.lazy(() => import('../../lib/useResources') );

import Tower from './Tower';

function WebglPart() {
  const { loadingProgress, setLoadingProgress } = React.useContext( LoadingProgressContext );
  return ( 
    <>
      <React.Suspense fallback={null}>
        <UseResources setLoadingProgress={setLoadingProgress} />
      </React.Suspense>
      
      { (loadingProgress === 100) && <Canvas
        dpr={1}
        shadows={false}
        gl={{
          powerPreference: 'high-performance',
          toneMappingExposure: 1.1,
        }}
        flat={false}
        className="webgl"
      >
        <Tower />
      </Canvas> }
    </>
  );
}

export default React.memo( WebglPart );
