import { PlaneGeometry, Object3D, Vector3 } from 'three';

import React from 'react';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

import GrassMaterial from './GrassMaterial.js';

const emptyObject = new PlaneGeometry(0.15, 0.15, 1, 1);

function Grass({ textures, count, radius = 25, grassSampler }) {
  // Inastance buffer
  const instancedBuffer = React.useRef(null);

  // Attributes and texturesType
  const grassParams = React.useMemo(() => {
    // grassSampler.geometry.toNonIndexed()
    const sampler = new MeshSurfaceSampler(grassSampler)
      .setWeightAttribute('random')
      .build();

    // resample basic
    const dummy = new Object3D();
    // const _position = new THREE.Vector3()
    const _position = new Vector3();
    const _normal = new Vector3();

    const position = [];
    const scale = [];
    const texture = [];
    const rotate = [];

    for (let i = 0; i < count; i++) {
      sampler.sample(_position, _normal);
      _normal.add(_position);

      // Dummy object
      dummy.position.copy(_position);
      dummy.lookAt(_normal);
      dummy.updateMatrix();

      // Calculated
      dummy.position.y = 0.3 * 0.5;

      // return attribues
      const k = 1 - Math.random() * Math.random() * Math.random();
      position.push({ position: dummy.position.clone() });

      rotate.push(
        (Math.random() * Math.random() - 0.5) * Math.PI * 0.1,
        (Math.random() - 0.5) * Math.PI * 0.1,
        (Math.random() * Math.random() - 0.5) * Math.PI * 0.1
      );

      scale.push(1 + Math.random() * Math.random());
      texture.push(Math.round(Math.random() * Math.random()));
    }
    const sortedOffset = sortPositions(
      new Vector3(0, 0, 20),
      position
    );

    return {
      offset: new Float32Array(sortedOffset),
      sizes: new Float32Array(scale),
      rotation: new Float32Array(rotate),
      textureType: new Float32Array(texture),
    };
  }, [count]);

  // Hooks
  React.useEffect(() => {
    if (!instancedBuffer.current) return;

    // Apply attributes
    const bufferGeometry = instancedBuffer.current;
    bufferGeometry.setAttribute(
      'position',
      emptyObject.attributes.position
    );
    bufferGeometry.setAttribute('uv', emptyObject.attributes.uv);
    bufferGeometry.setIndex(emptyObject.index);

    // Bounding sphere for frustumculled
    bufferGeometry.computeBoundingSphere();
    bufferGeometry.boundingSphere.radius = radius * 0.5;
  }, []);

  return (
    <>
      <mesh position={[0, -0.03, 0]}>
        <instancedBufferGeometry
          instanceCount={count}
          ref={instancedBuffer}
        >
          <instancedBufferAttribute
            attach={'attributes-offset'}
            args={[grassParams.offset, 3]}
            needsUpdate={true}
          />
          <instancedBufferAttribute
            attach={'attributes-scale'}
            args={[grassParams.sizes, 1]}
          />
          <instancedBufferAttribute
            attach={'attributes-rotation'}
            args={[grassParams.rotation, 3]}
          />
          <instancedBufferAttribute
            attach={'attributes-textureType'}
            args={[grassParams.textureType, 1]}
          />
        </instancedBufferGeometry>
        <GrassMaterial 
          toneMapped={true}
          uGrassAreaSize={radius} 
          uTexture={textures[0]}
          uTexture1={textures[1]} 
          uShadowMap={textures[2]}
          transparent={true}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// Sort grass layer
function sortPositions(camera, positions) {
  positions.sort((a, b) => {
    const d1 = camera.distanceToSquared(a.position);
    const d2 = camera.distanceToSquared(b.position);
    if (d1 > d2) {
      return -1;
    }
    if (d1 < d2) {
      return 1;
    }
    return 0;
  });

  const sortedPositions = [];
  positions.forEach((el) =>
    sortedPositions.push(el.position.x, el.position.y, el.position.z)
  );

  return sortedPositions;
}

export default React.memo( Grass );