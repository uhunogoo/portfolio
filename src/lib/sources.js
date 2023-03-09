function support_format_webp() {
  if (typeof window !== "undefined") {
    const elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
      // was able or not to get WebP representation
      return (
        elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
      );
    } else {
      // very old browser like IE 8, canvas not supported
      return false;
    }
  } else {
    return false;
  }
}

const isWebpSupport = support_format_webp();
const formatJPG = isWebpSupport ? '.webp' : '.jpg';
const formatPNG = isWebpSupport ? '.webp' : '.png';

export default [
  // MODELS
  {
    name: 'towerModel',
    type: 'gltfLoader',
    path: '/models/tower-model.glb',
  },
  //  TOWER
  {
    name: 'largeTexture',
    type: 'texture',
    asset: 'startParams',
    path: `/textures/largeTexture${formatJPG}`,
  },
  {
    name: 'otherTextures',
    type: 'texture',
    asset: 'startParams',
    path: `/textures/otherTextures${formatJPG}`,
  },
  {
    name: 'shadowMap',
    type: 'texture',
    asset: 'startParams',
    path: `/textures/shadowMap${formatJPG}`,
  },
  {
    name: 'sandTexture',
    type: 'texture',
    asset: 'startParams',
    path: `/textures/sand${formatJPG}`,
  },
  {
    name: 'groundTexture',
    type: 'texture',
    asset: 'startParams',
    path: `/textures/forest${formatJPG}`,
  },
  //  Grass
  {
    name: 'grassTexture',
    type: 'texture',
    path: `/textures/grass-1${formatPNG}`,
  },
  {
    name: 'grassSecondTexture',
    type: 'texture',
    path: `/textures/grass-2${formatPNG}`,
  },
  //  Fire
  {
    name: 'fireTexture',
    type: 'texture',
    path: `/textures/fire${formatJPG}`,
  },
  //  Clouds
  {
    name: 'cloud',
    type: 'texture',
    path: `/textures/cloud${formatPNG}`,
  },
  // Preload texture
  {
    name: 'preloadTexture',
    type: 'texture',
    path: `/textures/transition-intro-2.jpg`,
  },
];
