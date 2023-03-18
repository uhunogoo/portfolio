import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

import React from 'react'
import { Vector3 } from 'three'
import { MenuContext } from '../components/Providers/MenuProvider'
import { useMousePosition } from './useMouse'


const parameters = {
  position: new Vector3(0, -0.5, 12),
  cameraPosition: new Vector3(0, 0.75, 1),
  lookAt: new Vector3(0, 0, -10),
  k: 1
}

export function useCameraMove( cameraEmptyMesh ) {
  const cameraRef = React.useRef();
  const mouse = useMousePosition();
  const { menu } = React.useContext( MenuContext );
  const [ ctx ] = React.useState( gsap.context(() => {}) );
  const [ lookAtVector, setLookAtVector ] = React.useState( new Vector3() );
  const [ mouseVector, setMouseVector ] = React.useState( new Vector3() );

  // Convert mouse to Vector3
  React.useEffect(() => {
    const newMouseVector = mouseVector.clone();
    newMouseVector.x = mouse.x * 0.6;
    newMouseVector.y = mouse.y * 0.3 * -1;
    setMouseVector( newMouseVector );
  }, [ mouse ]);
  React.useEffect(() => {
    ctx.add('animateK', (v) => {
      const animation = gsap.to(parameters, {
        k: v,
        duration: 1,
        ease: 'power1.inOut'
      });
      return animation;
    });

    return () => ctx.revert();
  }, []);
  React.useEffect(() => {
    const k = menu !== 'default' ? 0 : 1;
    const delay = (menu === 'default') ? 0.6 : 0;
    gsap.delayedCall(delay, () => {
      ctx.animateK( k );
    });
  }, [menu]);

  // Calculate camera postion
  const vectorHandler = React.useCallback(( vector ) => {
    setLookAtVector( lookAtVector.lerp( mouseVector, 0.03 ) );

    const finalVector = vector.clone();
    finalVector.add( lookAtVector.multiplyScalar( parameters.k ) );
    finalVector.applyQuaternion(cameraEmptyMesh.quaternion);
    finalVector.add(cameraEmptyMesh.position);

    return finalVector;
  }, [ mouseVector, cameraEmptyMesh ]);
    
  // Apply camera position
  useFrame((state) => {
    const finalVector = vectorHandler( parameters.cameraPosition );
    const lookAtVector = vectorHandler( parameters.lookAt );

    cameraRef.current.position.copy( finalVector );
    cameraRef.current.lookAt( lookAtVector );
    cameraRef.current.updateProjectionMatrix();
  });

  return cameraRef;
}