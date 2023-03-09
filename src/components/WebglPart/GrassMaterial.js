import React from 'react'
import { Color } from 'three'

import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

// Shaders
import grassVertex from './shaders/grass/vertex.glsl'
import grassFragment from './shaders/grass/fragment.glsl'


const GrassShaderMaterial = shaderMaterial(
    {
        uHeight: 0.45,
        uIntesity: 0.1,
        uTime: 0,
        uTexture: null,
        uTexture1: null,
        uShadowMap: null,
        uGrassAreaSize: 0,
        uColor1: new Color('#f2dfc9').convertSRGBToLinear(),
        uColor2: new Color('#e4bc7d').convertSRGBToLinear(),
    },
    grassVertex,
    grassFragment
)
extend({ GrassShaderMaterial })

function GrassMaterial ( { ...props } ) {
    const grassMaterial = React.useRef();
    
    React.useEffect(() => {
      grassMaterial.current.uColor1 = new Color('#f2dfc9').convertSRGBToLinear();
      grassMaterial.current.uColor2 = new Color('#e4bc7d').convertSRGBToLinear();
    }, []);

    // Animation
    useFrame((state, delta) => {
        grassMaterial.current.uTime += delta
    });

    return <grassShaderMaterial ref={ grassMaterial } {...props} />
}

export default React.memo( GrassMaterial );