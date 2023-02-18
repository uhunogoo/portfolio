import { Color } from 'three'

import { useContext, useEffect, useRef, useMemo } from 'react'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// Shaders
import groundVertex from './shaders/ground/groundVertex.glsl?raw'
import groundFragment from './shaders/ground/groundFragment.glsl?raw'

import { SceneContext } from '../../Experience.jsx'

// Shader Material
const GroundShaderMaterial = shaderMaterial(
    {
        uTexture: null,
        uTexture_2: null,
        uShadow: null,
        uColorMask: new Color('#fec8a2')
    },
    groundVertex,
    groundFragment
)
extend({ GroundShaderMaterial })

export default function GroundMaterial( props ) {
    const data = useContext( SceneContext )
    const groundMaterial = useRef( null )
    const [sandstone, forest, shadowMap] = useMemo(() => [
        data.sandstone.clone(),
        data.forest.clone(),
        data.shadowMap.clone()
    ], [])
    

    useEffect(() => {
        groundMaterial.current.uTexture = sandstone
        groundMaterial.current.uTexture_2 = forest
        groundMaterial.current.uShadow = shadowMap
        groundMaterial.current.toneMapped = false
    }, [])
    
    return <groundShaderMaterial ref={ groundMaterial } {...props} />
}