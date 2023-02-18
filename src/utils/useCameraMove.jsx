import gsap from 'gsap'

import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial } from 'three'
import { useMousePosition } from './useMouse.js'


const parameters = {
    position: new Vector3(0, -0.5, 12),
    cameraPosition: new Vector3(0, 0.75, 1),
    lookAt: new Vector3(0, 0, -2)
}
const cameraEmptyMesh = new Mesh(
    new BoxGeometry(1.5, 1, 0.5, 1, 1, 1),
    new MeshBasicMaterial()
)

export function useCameraMove() {
    const mouse = useMousePosition();
    const vec = useMemo( () => new Vector3(), [] );
    const vecClone = useMemo( () => vec.clone(), [] );
    const camera = useThree( state => state.camera );
    
    const getVector = ( target, cameraEmptyMesh, mouseVec ) => {
        const vector = target.clone()
        vector.applyQuaternion(cameraEmptyMesh.quaternion)
        vector.add(cameraEmptyMesh.position)
        vector.add( mouseVec )
    
        return vector
    }
    
    const setInstance = () => {
        // Calculate camera
        camera.position.copy(getVector
        (
            parameters.cameraPosition,
            cameraEmptyMesh,
            vec
        ));
        camera.lookAt(getVector
        (
            parameters.lookAt,
            cameraEmptyMesh,
            vec
        ));
    }

    useEffect(() => {
        cameraEmptyMesh.position.copy(parameters.position);
        setInstance();
    }, []);

    return useFrame((state) => {
        vec.lerp( vecClone.set( mouse.x * 0.6, mouse.y * 0.3, 0 ), 0.04 );

        state.camera.updateProjectionMatrix();
        setInstance();
    });
}

export function useCameraEffect() {
    const effect = gsap.registerEffect({
        name: 'cameraAnimation',
        effect(target) {
            const { position, rotation } = target[0]
            const duration = 1.45
            
            // Animation
            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    overwrite: true,
                    duration: duration,
                    ease: 'power1',
                }
            })
            tl.to(cameraEmptyMesh.position, {
                x: position[0],
                y: position[1],
                z: position[2],
            })
            tl.to(cameraEmptyMesh.rotation, {
                x: Math.PI * 0.25 * rotation[0],
                y: Math.PI * 0.25 * rotation[1],
                z: Math.PI * 0.25 * rotation[2]
            }, 0)
    
            return tl
        }
    })

    return effect
}