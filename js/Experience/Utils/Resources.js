import { TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }
    setLoaders() {
        this.loaders = {}
        // Draco loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')

        // GLTF loader
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(dracoLoader)
        this.loaders.textureLoader = new TextureLoader()
    }
    startLoading() {      
        // Load each source
        for( const source of this.sources ) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load( source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'gltfLoader') {
                this.loaders.gltfLoader.load( source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            }
        }
    }
    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++
        this.trigger('loadingProgress')
        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}