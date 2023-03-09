import React from 'react';
import { Center } from '@react-three/drei';
import { PreloadedContext } from '../PreloadedContentProvider/PreloadedContentProvider';
import Grass from './Grass';
import GroundMaterial from './GroundMaterial';

function Tower({ children }) {
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
    const ground = model?.item.scene.children.find(
      (child) => child.name === 'ground'
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

    const grass1 = preloadedContent?.find(
      (el) => el.name === 'grassTexture'
    ).item;
    const grass2 = preloadedContent?.find(
      (el) => el.name === 'grassSecondTexture'
    ).item;
    const shadowMap = preloadedContent?.find(
      (el) => el.name === 'shadowMap'
    ).item;
    const sandTexture = preloadedContent?.find(
      (el) => el.name === 'sandTexture'
    ).item;
    const groundTexture = preloadedContent?.find(
      (el) => el.name === 'groundTexture'
    ).item;


    return {
      ground,
      shadowMap,
      towerPart1,
      towerPart2,
      towerPart3,
      towerPart4,
      largeTexture,
      otherTextures,
      grass1,
      grass2,
      sandTexture,
      groundTexture
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
        <group scale={0.45} dispose={ null }>
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
          <mesh position-y={0.01} rotation-x={-Math.PI * 0.5} >
              <circleGeometry args={[12.6, 40]}/>
              <GroundMaterial 
                uTexture={tower.sandTexture}
                uTexture_2={tower.groundTexture}
                uShadow={ tower.shadowMap }
                toneMapped={ false }
              />
          </mesh>
          <Grass
            textures={[
              tower.grass1,
              tower.grass2,
              tower.shadowMap
            ]}
            grassSampler={ tower.ground }
            count={40000}
            radius={ 25 }
          />
        </group>
        { children }
      </Center>
    </>
  );
}

export default Tower;
