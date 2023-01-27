import { Color } from 'three'

import { useControls } from 'leva'
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
    
    const controls = useControls('Grass parameters', {
        color1: '#f2dfc9',
        color2: '#e4bc7d',
        intesity: { value: 0.1, min: 0, max: 0.5, step: 0.001 },
        height: { value: 0.45, min: -1, max: 2, step: 0.001 }
    })

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
    
    useEffect(() => {
        // Set uniforms
        grassMaterial.current.uIntesity = controls.intesity
        grassMaterial.current.uHeight = controls.height
        grassMaterial.current.uColor1 = new Color(controls.color1).convertSRGBToLinear()
        grassMaterial.current.uColor2 = new Color(controls.color2).convertSRGBToLinear()
    }, [controls])

    // Animation
    useFrame((state, delta) => {
        grassMaterial.current.uTime += delta
    })
    return <grassShaderMaterial ref={ grassMaterial } {...props} />
}