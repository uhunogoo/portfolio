import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LoadingProgressContext } from '../LoadingProvider/LoadingProvider';
import { useResources } from '../../lib/useResources';

import Tower from './Tower';
import AnimatedMask from './AnimatedMask';
import {
  Float,
  Hud,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
} from '@react-three/drei';
import PostEffects from './PostEffects';
import CustomSky from './CustomSky';
import Fire from './Fire';

const cameraSettings = {
  fov: 55,
  near: 0.1,
  zoom: 0.75,
  far: 100,
  position: [0, 1, 9],
};

function WebglPart() {
  const { loadingProgress, setLoadingProgress } = React.useContext(
    LoadingProgressContext
  );
  useResources(setLoadingProgress);
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
          <OrbitControls />
          <PerspectiveCamera {...cameraSettings} makeDefault />
          <MainScene />
          <Hud renderPriority={2}>
            <orthographicCamera
              makeDefault
              position={[0, 0, 1]}
              near={0.1}
              far={0.5}
              zoom={80}
            />
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
        <Tower>
          <Fire count={260} radius={0.5} />
        </Tower>
      </Float>

      <Sparkles
        size={6}
        scale={[26, 0.1, 26]}
        position-y={-0.7}
        count={50}
      />
    </>
  );
}

export default React.memo(WebglPart);
