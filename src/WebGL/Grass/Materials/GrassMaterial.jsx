import { Color } from 'three'

import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useContext, useEffect, useRef, useMemo } from 'react'
import { SceneContext } from '../../Experience.jsx'

// Shaders
import grassVertex from './shaders/grass/grassVertex.glsl?raw'
import grassFragment from './shaders/grass/grassFragment.glsl?raw'


const GrassShaderMaterial = shaderMaterial(
    {
        uHeight: 0.45,
        uIntesity: 0.1,
        uTime: 0,
        uTexture: null,
        uTexture1: null,
        uShadowMap: null,
        uGrassAreaSize: 0,
        uColor1: new Color('#f2dfc9').convertSRGBToLinear(),
        uColor2: new Color('#e4bc7d').convertSRGBToLinear(),
    },
    grassVertex,
    grassFragment
)
extend({ GrassShaderMaterial })

export default function GrassMaterial ( { ...props } ) {
    const data = useContext( SceneContext )
    const grassMaterial = useRef( null )
    const [ shadowMap, texture1, texture2 ] = useMemo(() => [
        data.shadowMap.clone(),
        data.texture1.clone(),
        data.texture2.clone()
    ], [data])

    // Debuggin
    useEffect(() => {
        // Set grass textures
        grassMaterial.current.uShadowMap = shadowMap
        grassMaterial.current.uTexture = texture1
        grassMaterial.current.uTexture1 = texture2
        grassMaterial.current.transparent = true
        grassMaterial.current.depthTest = true
        grassMaterial.current.depthWrite = false
        // grassMaterial.current.blending = THREE.NormalBlending
    }, [])
    
    // Animation
    useFrame((state, delta) => {
        grassMaterial.current.uTime += delta
    })
    return <grassShaderMaterial ref={ grassMaterial } {...props} />
}