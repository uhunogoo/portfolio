import { useFrame } from '@react-three/fiber'

import React from 'react'
import { Vector3 } from 'three'
import { useMousePosition } from './useMouse'


const parameters = {
  position: new Vector3(0, -0.5, 12),
  cameraPosition: new Vector3(0, 0.75, 1),
  lookAt: new Vector3(0, 0, -2)
}

export function useCameraMove( cameraEmptyMesh ) {
  const cameraRef = React.useRef();
  const mouse = useMousePosition();

  const [ mouseVector, setMouseVector ] = React.useState( new Vector3() );
  const [ finalVector, setFinalVector ] = React.useState( new Vector3() );

  // Convert mouse to Vector3
  React.useEffect(() => {
    const newMouseVector = mouseVector.clone();
    newMouseVector.x = mouse.x * 0.6;
    newMouseVector.y = mouse.y * 0.3;
    setMouseVector( newMouseVector );
  }, [ mouse ]);

  // Calculate camera postion
  const vectorHandler = React.useCallback(() => {
    const newFinalVector = parameters.cameraPosition.clone();
    newFinalVector.applyQuaternion(cameraEmptyMesh.quaternion);
    newFinalVector.add(cameraEmptyMesh.position);
    newFinalVector.add( mouseVector );
  
    setFinalVector( newFinalVector );
  }, [ mouseVector ]);
    
  // Apply camera position
  useFrame((state) => {
    vectorHandler();
    cameraRef.current.position.lerp( finalVector, 0.04);
    cameraRef.current.lookAt( cameraEmptyMesh.position );
    cameraRef.current.updateProjectionMatrix();
  });

  return cameraRef;
}