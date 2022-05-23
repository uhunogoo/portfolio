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
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Renderer')
            this.debugFolder.close()
        }

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })

        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.toneMapping = THREE.ACESFilmicToneMapping
        // this.instance.toneMappingExposure = 1
        // Shadows
        // this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap

        
        // Debug renderer
        if (this.debug.active) {
            this.debugFolder
                .add( this.instance, 'toneMappingExposure')
                .min(0)
                .max(10)
                .step(0.001)
        }


        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )
    }
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )
    }
    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}