import { Vector2 } from 'three' 

import { shaderMaterial } from '@react-three/drei'
import { extend, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

// Shaders
import fragmentShader from './shaders/preloader/fragmentShader.glsl?raw'
import vertexShader from './shaders/preloader/vertexShader.glsl?raw'

// Shader Material
const MaskShaderMaterial = shaderMaterial(
    {
        uProgress: 1,
        uAspect: new Vector2(1, 1)
    },
    vertexShader,
    fragmentShader
)
extend({ MaskShaderMaterial })

export default function MaskMaterial ( props ) {
    const viewport = useThree((gl) => gl.viewport)
    const maskMaterial = useRef()

    useEffect(() => {
        const { aspect } = viewport
        const aspectVector = (aspect > 1) ? [ aspect, 1 ] : [ 1, aspect]
        
        maskMaterial.current.uAspect.fromArray( aspectVector )
    }, [viewport])

    return <maskShaderMaterial ref={ maskMaterial } {...props} />
}