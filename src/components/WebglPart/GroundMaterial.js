import React from 'react';
import { Color } from 'three';

import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Shaders
import groundVertex from './shaders/ground/vertex.glsl';
import groundFragment from './shaders/ground/fragment.glsl';

// Shader Material
const GroundShaderMaterial = shaderMaterial(
  {
    uTexture: null,
    uTexture_2: null,
    uShadow: null,
    uColorMaskSecond: new Color('#f2dfc9'),
    uColorMask: new Color('#fec8a2'),
  },
  groundVertex,
  groundFragment
);
extend({ GroundShaderMaterial });

function GroundMaterial(props) {
  return <groundShaderMaterial {...props} />;
}

export default React.memo( GroundMaterial );