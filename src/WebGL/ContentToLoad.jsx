import { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { support_format_webp } from '../utils/modernImageFormat'


export default function ContentToLoad ( { updateData, updateStatus }, props ) {
    // Tower
    const isWebpSupport = support_format_webp()
    const formatJPG = isWebpSupport ? '.webp' : '.jpg'
    const formatPNG = isWebpSupport ? '.webp' : '.png'

    const towerTextures = useTexture({
        largeTexture: '/textures/largeTexture' + formatJPG,  // tower
        otherTexture: '/textures/otherTextures' + formatJPG, // tower
        shadowMap: '/textures/shadowMap' + formatJPG, // ground / grass
        sandstone: '/textures/sand' + formatJPG, // ground
        texture1: '/textures/grass-1' + formatPNG, // grass
        texture2: '/textures/grass-2' + formatPNG, // grass
        forest: '/textures/forest' + formatJPG, // ground
        cloud: '/textures/cloud' + formatPNG, // clouds
        fireTexture: '/textures/fire' + formatJPG, // fire
    })
    // Transform texture
    towerTextures.largeTexture.flipY = false
    towerTextures.otherTexture.flipY = false

    // Model
    const model = useGLTF( '/models/tower-model.glb' )

    useEffect(() => {
        // Combine loaded data
        const data = Object.assign( { model }, towerTextures )

        // Add loaded content to the main
        updateData( data )
        updateStatus( true )
    }, [])
}
useGLTF.preload('/models/tower-model.glb')

// function support_format_webp() {
//     const elem = document.createElement('canvas');

//     if (!!(elem.getContext && elem.getContext('2d'))) {
//         // was able or not to get WebP representation
//         return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
//     } else {
//         // very old browser like IE 8, canvas not supported
//         return false
//     }
// }