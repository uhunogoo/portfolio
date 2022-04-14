import * as THREE from 'three' 
import Experience from './Experience'

export default class Renderer {
    constructor() {
        // Setup
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
        })

        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.physicallyCorrectLights = true
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.76

        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( this.sizes.pixelRatio )
    }
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( this.sizes.pixelRatio )
    }
    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}