import { useFrame } from '@react-three/fiber'

import React from 'react';
import { Vector3 } from 'three';
import { useMousePosition } from './useMouse';


const parameters = {
  position: new Vector3(0, -0.5, 2),
  cameraPosition: new Vector3(0, 0.75, 1),
  lookAt: new Vector3(0, 0, -3)
}

export function useCameraMove( cameraEmptyMesh ) {
  const cameraRef = React.useRef();
  const mouse = useMousePosition();
  const vec = React.useMemo( () => new Vector3(), [] );
  const vecClone = React.useMemo( () => vec.clone(), [] );
    
    const getVector = ( target, cameraEmptyMesh, mouseVec ) => {
        const vector = target.clone()
        vector.applyQuaternion(cameraEmptyMesh.quaternion)
        vector.add(cameraEmptyMesh.position)
        vector.add( mouseVec )
    
        return vector
    }
    
    const setInstance = () => {
        // Calculate camera
        cameraRef.current.position.copy(getVector
        (
            parameters.cameraPosition,
            cameraEmptyMesh,
            vec
        ));
        cameraRef.current.lookAt(getVector
        (
            parameters.lookAt,
            cameraEmptyMesh,
            vec
        ));
    }

    React.useEffect(() => {
        cameraEmptyMesh.position.copy(parameters.position);
        setInstance();
    }, []);
    React.useEffect(() => {
        cameraEmptyMesh.position.copy(parameters.position);
        setInstance();
    }, []);

    useFrame((state) => {
        vec.lerp( vecClone.set( mouse.x * 0.45, mouse.y * 0.2 * -1, 0 ), 0.04 );
        cameraRef.current.updateProjectionMatrix();
        setInstance();
    });

  return cameraRef;
}