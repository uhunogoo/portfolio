import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LoadingProgressContext } from '../LoadingProvider/LoadingProvider';
import { useResources } from '../../lib/useResources';

import Tower from './Tower';
import AnimatedMask from './AnimatedMask';
import { Hud } from '@react-three/drei';
import PostEffects from './PostEffects';

function WebglPart() {
  const { loadingProgress, setLoadingProgress } = React.useContext( LoadingProgressContext );
  useResources( setLoadingProgress )
  return ( 
    <>
      { (loadingProgress === 100) && 
        <Canvas
          dpr={1}
          shadows={false}
          gl={{
            powerPreference: 'high-performance',
            toneMappingExposure: 1.1,
          }}
          flat={false}
          className="webgl"
        >
          <PostEffects />
          <Tower />
          <Hud renderPriority={ 2 }>
            <orthographicCamera makeDefault position={[0, 0, 1]} near={0.1} far={0.5} zoom={80} />
            <AnimatedMask />
          </Hud>
        </Canvas> 
      }
    </>
  );
}

export default React.memo( WebglPart );
