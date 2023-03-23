import gsap from 'gsap';
import React from 'react';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { EnterContext } from '../components/Providers/EnterProvider';
import { MenuContext } from '../components/Providers/MenuProvider';

export function useCameraPath() {
  const { enterStatus } = React.useContext( EnterContext );
  const { menu } = React.useContext( MenuContext );
  const [ ctx ] = React.useState( gsap.context(() => {}) );
  const [ base, about, works ] = React.useMemo(() => [
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

  React.useLayoutEffect(() => {
    cameraEmptyMesh.position.y = -0.7;
    cameraEmptyMesh.position.z = 10;

    ctx.add('cameraMove', ({ position, rotation })=> {
      const tl = gsap.timeline({
        paused: true,
        defaults: {
            overwrite: true,
            duration: 1.45,
            ease: 'power1',
            ease: 'back(1.4)'
        }
      })
      tl.to(cameraEmptyMesh.position, {
        x: position[0],
        y: position[1],
        z: position[2],
      });
      tl.to(cameraEmptyMesh.rotation, {
        x: rotation[0],
        y: rotation[1]
      }, 0);

      return tl.timeScale( 1 );
    });

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    if ( !enterStatus ) return;
    // base, about, works
    const target = (menu === 'default') ? base : 
                   (menu === 'about') ? about : works;
    
    const delay = (menu === 'default') ? 0.8 : 0;
    const timescale = (menu === 'default') ? 0.8 : 1;
    
    gsap.delayedCall(delay, () => {
      ctx.cameraMove( target, timescale ).play();
    });
  }, [ menu, enterStatus ]);

  return cameraEmptyMesh;
}
