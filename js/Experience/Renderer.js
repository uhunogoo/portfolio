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

        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.CustomToneMapping
        this.instance.toneMappingExposure = 1

        THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
        )

        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.autoUpdate = false
        this.instance.shadowMap.needsUpdate = true

        
        // Debug renderer
        if (this.debug.active) {
            this.debugFolder
                .add( this.instance, 'toneMappingExposure')
                .min(0)
                .max(10)
                .step(0.001)
        }


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