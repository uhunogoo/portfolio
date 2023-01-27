import gsap from 'gsap'

import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setMouse } from '../../mouseSlice.js'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'
import { BoxGeometry } from 'three'
import { MeshBasicMaterial } from 'three'

const parameters = {
    position: new Vector3(0, -0.5, 12),
    cameraPosition: new Vector3(0, 0.75, 1),
    lookAt: new Vector3(0, 0, -2)
}
const cameraEmptyMesh = new Mesh(
    new BoxGeometry(1.5, 1, 0.5, 1, 1, 1),
    new MeshBasicMaterial()
)

export function Mouse({ mouse }) {
    const vec = useMemo(() => new Vector3(), [])
    const dispatch = useDispatch()
    const camera = useThree( state => state.camera )
    
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
        ))
        camera.lookAt(getVector
        (
            parameters.lookAt,
            cameraEmptyMesh,
            vec
        ))
        // camera.updateProjectionMatrix()
    }
    useEffect(() => {
        cameraEmptyMesh.position.copy(parameters.position)
        setInstance()
    }, [])

    useLayoutEffect(() => {
        const moveX = gsap.quickTo(vec, 'x', {
            ease: 'power1.out',
            duration: 0.6,
            immediateRender: true
        })
        const moveY = gsap.quickTo(vec, 'y', {
            ease: 'power1.out',
            duration: 0.6,
            immediateRender: true
        })

        const onMove = () => {
            dispatch(setMouse({ x: mouse.x, y: mouse.y }))

            moveX(mouse.x * 0.5)
            moveY(mouse.y * 0.25)
        }
        window.addEventListener('pointermove', onMove)

        return () => {
            window.removeEventListener('pointermove', onMove)
        }
    }, [])

    
    return useFrame((state, delta) => {
        state.camera.updateProjectionMatrix()
        setInstance()
    })
}

export function useCameraEffect() {
    // gsap.registerPlugin( SlowMo )
    const effect = gsap.registerEffect({
        name: 'cameraAnimation',
        effect(target) {
            const { position, rotation } = target[0]
            const duration = 1.45
            
            // Animation
            const tl = gsap.timeline({
                paused: true,
                defaults: {
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