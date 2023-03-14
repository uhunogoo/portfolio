import React from 'react';
// import gsap from 'gsap';
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei';
import { PreloadedContext } from '../Providers/PreloadedContentProvider';
import { EnterContext } from '../Providers/EnterProvider';

import { gsap } from "gsap";
import { SlowMo } from 'gsap/dist/EasePack';

const ColorShiftMaterial = shaderMaterial(
  {
    uProgress: 1, 
    uTexture: null,
  },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vec3 st = position;
      st.xy *= 3.4;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(st, 1.0);
      
      // Varying
      vUv = uv;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float uProgress;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main() {
      vec2 st = vUv;
      // float t = (1.0 + sin(uProgress)) / 2.0;
      float t = uProgress;

      // Textures
      vec4 image = texture2D( uTexture, st);
      
      float strength = 1.0 - smoothstep( 0.0 + t, 0.15 + t, image.r ); 
      vec3 color = vec3( strength );

      vec4 finalMask = vec4( vec3(1.0), strength );
      gl_FragColor = finalMask;
    }
  `
)

// declaratively
extend({ ColorShiftMaterial });

function AnimatedMask() {
  gsap.registerPlugin(SlowMo);
  const shader = React.useRef();
  
  const { preloadedContent } = React.useContext(PreloadedContext);
  const { enterStatus } = React.useContext(EnterContext);

  /**
   * Apply textures and defaults parameters  
   */
  React.useEffect(() => {
    const preloadedTexture = preloadedContent.find(el => 
      el.name === 'preloadTexture' 
    );

    shader.current.uTexture = preloadedTexture.item;
  }, [ preloadedContent ]);

  /**
   * Animation  
   */
  React.useEffect(() => {
    if (!enterStatus) return;

    const ctx = gsap.context(() => {
      

      gsap.to(shader.current, {
        uProgress: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'slow(0.1, 0.4)'
      });
    });

    return () => {
      ctx.revert();
    }
  }, [ enterStatus ]);

  return (
    <mesh scale={12}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <colorShiftMaterial 
        ref={ shader } 
        transparent={ true }
      />
    </mesh>
  );
}

export default React.memo(AnimatedMask);
