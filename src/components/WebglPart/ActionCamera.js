import React from 'react';
import {gsap} from 'gsap';
import { PerspectiveCamera } from '@react-three/drei';
import { useCameraMove } from '../../lib/useCameraMove';
import { useCameraPath } from '../../lib/useCameraPath';
import { EnterContext } from '../Providers/EnterProvider';
import { MenuContext } from '../Providers/MenuProvider';

function ActionCamera() {
  const cameraSettings = React.useMemo(() => ( {
    fov: 45,
    near: 0.1,
    zoom: 0.75,
    far: 100,
    position: [0, 1, 9],
  } ), []);

  // Animate camera by path
  const [cameraEmptyMesh, defaultPositions] = useCameraPath();
  // // Animate camera on mouse move
  const cameraRef = useCameraMove(cameraEmptyMesh);

  return (
    <AnimateCamera
      cameraRef={ cameraRef }
      cameraEmptyMesh={ cameraEmptyMesh }
      defaultPositions={ defaultPositions }
    >
      <PerspectiveCamera
        ref={cameraRef}
        {...cameraSettings}
        makeDefault
      />
    </AnimateCamera>
  );
}

function AnimateCamera({ children, cameraRef, cameraEmptyMesh, defaultPositions }) {
  const [ base, about, works ] = defaultPositions;
  const { enterStatus } = React.useContext( EnterContext );
  const { menu } = React.useContext( MenuContext );
  const [ ctx ] = React.useState( gsap.context(() => {}) );

  React.useEffect(() => {
    ctx.add('cameraMove', ({ position, rotation }, fov, zoom)=> {
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          immediateRender: true,
          overwrite: true,
          duration: 1.45,
          ease: 'power2'
        }
      });
      tl.to(cameraEmptyMesh.position, {
        x: position[0],
        y: position[1],
        z: position[2],
      });
      tl.to(cameraEmptyMesh.rotation, {
        x: rotation[0],
        y: rotation[1]
      }, 0);
      tl.to(cameraRef.current, {
        fov: fov,
        zoom: zoom,
      }, 0);

      return tl.timeScale( 1 );
    });

    return () => ctx.revert();
  }, [cameraEmptyMesh, cameraRef ]);

  React.useEffect(() => {
    if ( !enterStatus ) return;
    // base, about, works
    const target = (menu === 'default') ? base : 
                   (menu === 'about') ? about : works;
                   
    const fov = (menu === 'default') ? 45 : 30;
    const zoom = (menu === 'default') ? 0.75 : 1.5;
    const delay = (menu === 'default') ? 0.8 : 0;
    // const timescale = (menu === 'default') ? 0.8 : 1;
    
    gsap.delayedCall(delay, () => {
      ctx.cameraMove( target, fov, zoom ).play();
    });
  }, [ menu, enterStatus ]);

  return <>
    { children }
  </>;
}

export default React.memo(ActionCamera);
