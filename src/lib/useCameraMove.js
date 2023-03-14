import { useFrame } from '@react-three/fiber'

import React from 'react'
import { Vector3 } from 'three'
import { useMousePosition } from './useMouse'


const parameters = {
  position: new Vector3(0, -0.5, 12),
  cameraPosition: new Vector3(0, 0.75, 1),
  lookAt: new Vector3(0, 0, -10)
}

export function useCameraMove( cameraEmptyMesh ) {
  const cameraRef = React.useRef();
  const mouse = useMousePosition();
  const [ lookAtVector, setLookAtVector ] = React.useState( new Vector3() );
  const [ mouseVector, setMouseVector ] = React.useState( new Vector3() );

  // Convert mouse to Vector3
  React.useEffect(() => {
    const newMouseVector = mouseVector.clone();
    newMouseVector.x = mouse.x * 0.6;
    newMouseVector.y = mouse.y * 0.3 * -1;
    setMouseVector( newMouseVector );

  }, [ mouse ]);

  // Calculate camera postion
  const vectorHandler = React.useCallback(( vector ) => {
    setLookAtVector( lookAtVector.lerp( mouseVector, 0.03 ) );

    const finalVector = vector.clone();
    finalVector.applyQuaternion(cameraEmptyMesh.quaternion);
    finalVector.add(cameraEmptyMesh.position);

    finalVector.add( lookAtVector );

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