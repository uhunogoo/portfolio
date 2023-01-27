import { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'


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

    // const contentImages = [
    //     '/backgrounds/works.svg',
    //     '/backgrounds/about.svg',
    //     '/backgrounds/image' + formatJPG,
    //     '/backgrounds/myworks/project-1' + formatJPG,
    //     '/backgrounds/myworks/project-2' + formatJPG,
    //     '/backgrounds/myworks/project-3' + formatJPG,
    //     '/backgrounds/myworks/project-4' + formatJPG,
    //     '/backgrounds/icon-1.svg',
    //     '/backgrounds/icon-2.svg',
    //     '/backgrounds/icon-3.svg',
    //     '/backgrounds/compass.svg',
    //     '/backgrounds/compass-dots.png', 
    //     '/backgrounds/compass-letter.png',
    //     '/backgrounds/grece.svg',
    //     '/backgrounds/dot.svg',
    // ]

    // Model
    const model = useGLTF( '/models/tower-model.glb' )

    // Content image loading progress
    // const contentImagesLoading = useContentImages(contentImages)

    useEffect(() => {
        // contentImages.forEach( src => {
        //     const image = new Image()
        //     image.src = src 
        // })
        // Combine loaded data
        const data = Object.assign( { model }, towerTextures )

        // Add loaded content to the main
        updateData( data )
        updateStatus( true )
    }, [])
}
useGLTF.preload('/models/tower-model.glb')

function support_format_webp() {
    const elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    } else {
        // very old browser like IE 8, canvas not supported
        return false
    }
}