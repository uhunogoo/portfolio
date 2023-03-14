import gsap from 'gsap';
import React from 'react';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { EnterContext } from '../components/Providers/EnterProvider';

export function useCameraPath() {
  const { enterStatus } = React.useContext( EnterContext );
  const cameraEmptyMesh = React.useMemo(() => {
    const mesh = new Mesh(
      new BoxGeometry(1.5, 1, 0.5, 1, 1, 1),
      new MeshBasicMaterial()
    );

    return mesh;
  }, []);

  React.useEffect(() => {
    cameraEmptyMesh.position.y = -0.7
    cameraEmptyMesh.position.z = 10
  }, []);

  React.useEffect(() => {
    if ( !enterStatus ) return;
    const ctx = gsap.context(() => {
      gsap.to( cameraEmptyMesh.position, {
        z: 5,
        duration: 2,
        ease: 'back(1.4)',
      });
    });
    
    return () => {
      ctx.revert();
    } 
  }, [ enterStatus ]);

  return cameraEmptyMesh;
}
