import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useContext, useEffect, useMemo, useRef } from 'react'

import fragmentShader from './shaders/fire/fireFragment.glsl?raw'
import vertexShader from './shaders/fire/fireVertex.glsl?raw'
import { SceneContext } from '../../Experience.jsx'

// Shader Material
const FireShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: null
    },
    vertexShader,
    fragmentShader
)
extend({ FireShaderMaterial })

export default function FireMaterial({ ...props }) {
    const data = useContext( SceneContext )
    const fireTexture = useMemo( () => data.fireTexture.clone(), [])
    const fireMaterial = useRef(null)
    useEffect(() => {
        // Set grass textures
        fireMaterial.current.uTexture = fireTexture
    }, [])

    useFrame((state, delta) => {
        fireMaterial.current.uTime += delta 
    })

    return <fireShaderMaterial ref={ fireMaterial } { ...props } />
}
