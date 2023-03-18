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
      position: [ -2, -1, 3.5 ],
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

  React.useEffect(() => {
    cameraEmptyMesh.position.y = -0.7;
    cameraEmptyMesh.position.z = 10;

    ctx.add('cameraMove', ({ position, rotation }, timescale)=> {
      const tl = gsap.timeline({
        defaults: { 
          duration: 1,
          ease: 'power1.inOut'
        }
      });
      tl.to(cameraEmptyMesh.position, {
        x: position[0],
        y: position[1],
        z: position[2]
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
    const ctx = gsap.context(() => {
      gsap.to( cameraEmptyMesh.position, {
        z: 5,
        duration: 2,
        ease: 'back(1.4)'
      });
    });
    
    return () => ctx.revert();
  }, [ enterStatus ]);

  React.useEffect(() => {
    if ( !enterStatus ) return;
    // base, about, works
    const target = (menu === 'default') ? base : 
                   (menu === 'about') ? about : works;
    const delay = (menu === 'default') ? 0.6 : 0;
    const timescale = (menu === 'default') ? 0.8 : 1;
    gsap.delayedCall(delay, () => {
      ctx.cameraMove( target, timescale );
    });
  }, [ menu ]);

  return cameraEmptyMesh;
}
