import React from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

// Shader Material
const FireShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null
  },
  // vertex shader
  /*glsl*/`
    uniform float uTime;

    attribute vec3 offset;
    attribute float scale;
    attribute float rotation;
    attribute float speed;
    attribute float opacity;
    attribute vec3 color;

    // varying
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;
    varying float vStrength;

    // Functions
    mat2 get2dRotateMatrix(float _angle)
    {
      return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    void main() {
      float t = uTime;
      t *= 1.7;

      vec3 st = position;

      st *= scale;
      st.xy *= get2dRotateMatrix( t * speed );
      
      float strength = mod( t * speed, 1.0 );
      float scaleAction = - abs((strength - 0.5) * 2.0) + 1.0;
      
      st.xy *= scale * scaleAction;
      st.y += (strength * 0.8 - 0.5);
      
      vec3 point = offset;
      point.xz *= get2dRotateMatrix( st.y * 2.0 + speed );

      st += point;

      // vec4 modelViewPosition = modelViewMatrix * vec4(position + offset, 1.0);
      vec4 modelViewPosition = modelViewMatrix * vec4(st, 1.0);
      vec4 projectionPosition = projectionMatrix * modelViewPosition;


      // Final
      gl_Position = projectionPosition;


      // varying
      vUv = uv;
      vStrength = strength;
      vOpacity = opacity * scaleAction;
      vColor = color;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;
    varying float vStrength;
    
    void main() {
      vec2 st = vUv;
  
      vec4 fireTexture = texture2D( uTexture, st );
  
      // final
      gl_FragColor = vec4( fireTexture.rgb * vColor, vOpacity);
  
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
  `
)
extend({ FireShaderMaterial })

export default function FireMaterial({ ...props }) {
    const fireMaterial = React.useRef(null)

    useFrame((state, delta) => {
        fireMaterial.current.uTime += delta 
    })

    return <fireShaderMaterial ref={ fireMaterial } { ...props } />
}