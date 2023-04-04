import React from 'react';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export function useCameraPath() {
  const defaultPositions = React.useMemo(() => [
    // Default
    {
      position: [ 0, -0.7, 5 ],
      rotation: [ 0, 0, 0 ]
    },
    // About
    {
      position: [ 0, -0.6, 0.1 ],
      rotation: [ -Math.PI * 0.15, 0, 0 ]
    },
    // Works
    {
      position: [ -1.5, -1, 3.5 ],
      rotation: [ 0, Math.PI * 0.35, 0 ]
    },
  ], []); 

  const cameraEmptyMesh = React.useMemo(() => {
    const mesh = new Mesh(
      new BoxGeometry(1.5, 1, 0.5, 1, 1, 1),
      new MeshBasicMaterial()
    );

    return mesh;
  }, []);

  

  return [ cameraEmptyMesh, defaultPositions ];
}
