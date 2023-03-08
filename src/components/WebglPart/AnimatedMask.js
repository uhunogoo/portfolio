import React from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber'
import { PreloadedContext } from '../PreloadedContentProvider/PreloadedContentProvider';

const ColorShiftMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uTexture: null, 
    uNoiseTexture: null, 
  },
  // vertex shader
  /*glsl*/`
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      float t = (1.0 + sin(uTime)) / 2.0;
      vec3 st = position;
      st.xy *= 3.4;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(st, 1.0);
      
      // Varying
      vUv = uv;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform sampler2D uNoiseTexture;
    varying vec2 vUv;
    void main() {
      vec2 st = vUv;
      float t = (1.0 + sin(uTime)) / 2.0;

      // Textures
      vec4 noise = texture2D( uNoiseTexture, st );
      float noiseData = 1.0 - smoothstep(0.2 + t, 0.5 + t, abs(noise.r));
      vec4 image = texture2D( uTexture, st);
      
      float strength = 1.0 - smoothstep( 0.0 + t, 0.2 + t, image.r ); 
      vec3 color = vec3( strength );

      vec4 finalMask = vec4(color, strength);
      gl_FragColor = finalMask;
    }
  `
)

// declaratively
extend({ ColorShiftMaterial });

function AnimatedMask() {
  const shader = React.useRef();
  const { preloadedContent } = React.useContext(PreloadedContext);
  React.useEffect(() => {
    const preloadedTexture = preloadedContent.find(el => el.name === 'preloadTexture' );
    const noiseTexture = preloadedContent.find(el => el.name === 'noiseTexture' );
    console.log( 'texture', preloadedTexture );
    console.log( 'shader', shader.current );
    shader.current.uTexture = preloadedTexture.item;
    shader.current.uNoiseTexture = noiseTexture.item;

  }, [ preloadedContent ]);

  useFrame((self, delta) => {
    shader.current.uTime += delta;
  });

  return (
    <mesh
      scale={3}
    >
      <planeGeometry args={[2, 2, 1, 1]} />
      <colorShiftMaterial ref={ shader } transparent={ true }/>
      {/* <meshBasicMaterial color={'red'} /> */}
    </mesh>
  );
}

export default React.memo(AnimatedMask);
