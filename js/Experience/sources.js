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

const isWebpSupport = support_format_webp()
const formatJPG = isWebpSupport ? '.webp?url' : '.jpg?url'
const formatPNG = isWebpSupport ? '.webp?url' : '.png?url'

export default [
    // MODELS
    {
        name: 'towerModel',
        type: 'gltfLoader',
        path: '/geometry/postament-draco-new.glb?url'
    },
    //  TOWER
    {
        name: 'towerTexture1',
        type: 'texture',
        asset: 'startParams',
        path: `/textures/tower/floorTexture${ formatJPG }`
    },
    {
        name: 'towerTexture2',
        type: 'texture',
        asset: 'startParams',
        path: `/textures/tower/wallTexture${ formatJPG }`
    },
    {
        name: 'towerTexture3',
        type: 'texture',
        asset: 'startParams',
        path: `/textures/tower/otherTextures${ formatJPG }`
    },
    {
        name: 'shadowMap',
        type: 'texture',
        asset: 'startParams',
        path: `/textures/tower/shadowMap${ formatJPG }`
    },
    {
        name: 'sandTexture',
        type: 'texture',
        asset: 'startParams',
        path: `/textures/runes/sand${ formatJPG }`
    },
    //  Point
    {
        name: 'pointTexture',
        type: 'texture',
        path: `/textures/runes/point${ formatPNG }`
    },
    //  Grass
    {
        name: 'grassTexture',
        type: 'texture',
        path: `/textures/runes/grass${ formatPNG }`
    },
    //  Clouds
    {
        name: 'cloud',
        type: 'texture',
        asset: 'startParams',
        path: `/backgrounds/cloud${ formatPNG }`
    },
    {
        name: 'cloud2',
        type: 'texture',
        asset: 'startParams',
        path: `/backgrounds/cloud-2${ formatPNG }`
    },
]