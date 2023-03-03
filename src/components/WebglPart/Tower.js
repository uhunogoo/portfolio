import { Center, Float, Sparkles } from '@react-three/drei';
import React from 'react';
import { PreloadedContext } from '../PreloadedContentProvider/PreloadedContentProvider';

function Tower() {
  // Parameters
  const floatingParams = {
    speed:  1.4,
    floatIntensity: 1.2,
    rotationIntensity:  0.3,
    floatingRange: [-0.2, 0.2],
  }
  console.log( 'Tower call' )
  // Hooks
  const { preloadedContent } = React.useContext(PreloadedContext);
  const [decorMaterial, setDecorMaterial] = React.useState(null);
  const tower = React.useMemo(() => {
    const model = preloadedContent?.find(
      (el) => el.name === 'towerModel'
    );

    const towerPart1 = model?.item.scene.children.find(
      (child) => child.name === 'tower'
    );
    const towerPart2 = model?.item.scene.children.find(
      (child) => child.name === 'runic'
    );
    const towerPart3 = model?.item.scene.children.find(
      (child) => child.name === 'components'
    );
    const towerPart4 = model?.item.scene.children.find(
      (child) => child.name === 'portal'
    );

    // largeTexture
    // otherTextures
    const largeTexture = preloadedContent?.find(
      (el) => el.name === 'largeTexture'
    ).item;
    const otherTextures = preloadedContent?.find(
      (el) => el.name === 'otherTextures'
    ).item;

    largeTexture.flipY = false;
    otherTextures.flipY = false;

    return {
      towerPart1,
      towerPart2,
      towerPart3,
      towerPart4,
      largeTexture,
      otherTextures,
    };
  }, [preloadedContent]);

  return (
    <>
      {/* Reusable material */}
      <meshBasicMaterial
        ref={setDecorMaterial}
        map={tower.otherTextures}
      />

      <Center disableX disableZ>
        <Float {...floatingParams}>
          <group scale={0.45}>
            <mesh
              geometry={tower.towerPart1.geometry}
            >
              <meshBasicMaterial map={tower.largeTexture} />
            </mesh>
            <mesh
              geometry={tower.towerPart2.geometry}
              material={ decorMaterial }
            />
            <mesh
              geometry={tower.towerPart3.geometry}
              material={ decorMaterial }
            />

            <mesh
              geometry={tower.towerPart4.geometry}
            >
              <meshBasicMaterial />
            </mesh>
          </group>
        </Float>
        <Sparkles
          size={6}
          scale={[26, 0.1, 26]}
          position-y={0.3}
          count={50}
        />
      </Center>
    </>
  );
}

export default Tower;
