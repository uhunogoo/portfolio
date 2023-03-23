import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Hud, OrbitControls, OrthographicCamera } from '@react-three/drei';
import { LoadingProgressContext } from '../Providers/LoadingProvider';
import { useResources } from '../../lib/useResources';

import AnimatedMask from './AnimatedMask';
import PostEffects from './PostEffects';
import CustomSky from './CustomSky';
import Tower from './Tower';
import Fire from './Fire';
import ActionCamera from './ActionCamera';

function WebglPart() {
  const { 
    loadingProgress, 
    setLoadingProgress 
  } = React.useContext( LoadingProgressContext );

  useResources( setLoadingProgress );

  return (
    <>
      {loadingProgress === 100 && (
        <Canvas
          dpr={1}
          shadows={false}
          gl={{
            powerPreference: 'high-performance',
            toneMappingExposure: 1.1,
          }}
          className="webgl"
        >
          <MainScene/>

          <Hud renderPriority={2}>
            <OrbitControls />
            <OrthographicCamera
              far={10}
              zoom={80}
              near={0.1}
              position={[0, 0, 2]}
              makeDefault
            >
            </OrthographicCamera>
            <AnimatedMask />
          </Hud>
        </Canvas>
      )}
    </>
  );
}

function MainScene() {
  // Parameters
  const floatingParams = {
    speed: 1.4,
    floatIntensity: 1.2,
    rotationIntensity: 0.3,
    floatingRange: [-0.2, 0.2],
  };

  return (
    <>
      <PostEffects />
      <CustomSky />

      <Float {...floatingParams}>
        <ActionCamera />
        <Tower>
          <Fire count={260} radius={0.5} />
        </Tower>
      </Float>

      {/* <Sparkles
        size={6}
        scale={[26, 0.1, 26]}
        position-y={-0.7}
        count={50}
      /> */}
    </>
  );
}

export default React.memo(WebglPart);
