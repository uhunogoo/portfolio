import gsap from 'gsap';
import React from 'react';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export function useCameraPath() {
  const cameraEmptyMesh = React.useMemo(() => {
    const mesh = new Mesh(
      new BoxGeometry(1.5, 1, 0.5, 1, 1, 1),
      new MeshBasicMaterial()
    );

    return mesh;
  }, []);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // tl.fromTo( cameraEmptyMesh.position, { z: 1 },{
      //   z: 8,
      //   repeat: -1,
      //   yoyo: true,
      //   duration: 2
      // }, 0);
      tl.to( cameraEmptyMesh.rotation, {
        y: Math.PI * 0.25,
        repeat: -1,
        yoyo: true,
        duration: 2
      }, 0);
    });
    
    return () => {
      ctx.revert();
    } 
  }, [ cameraEmptyMesh ]);

  return cameraEmptyMesh;
}
