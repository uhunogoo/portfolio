import { Color } from 'three'

import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// Shaders
import portalVertex from './shaders/portal/portalVertex.glsl?raw'
import portalFragment from './shaders/portal/portalFragment.glsl?raw'

// Shader Material
const PortalShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new Color('#d4b268').convertSRGBToLinear(),
        uColor2: new Color('#ebebeb').convertSRGBToLinear()
    },
    portalVertex,
    portalFragment
)
extend({ PortalShaderMaterial })

export default function PortalMaterial( props ) {
    
    return <portalShaderMaterial {...props} />
}