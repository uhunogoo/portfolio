import React from 'react';
import { BlendFunction } from 'postprocessing';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';

function PostEffects() {
  const bloomSettings = {
    intensity: 0.35,
    radius: 1,
    levels: 2,
    luminanceThreshold: 0,
    luminanceSmoothing: 0.17,
  };

  return (
    <>
      <EffectComposer
        multisampling={3}
        disableNormalPass={true}
      >
        <Vignette
          offset={0.3}
          eskil={false}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom mipmapBlur {...bloomSettings} />
      </EffectComposer>
    </>
  );
}

export default React.memo(PostEffects);
