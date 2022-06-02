import * as THREE from 'three' 
import Experience from './Experience'

// Post Processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'


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
        this.setPostprocess()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        })

        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.toneMapping = THREE.CineonToneMapping

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
    setPostprocess() {
        const renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                samples: this.instance.getPixelRatio() === 1 ? 2 : 0
            }
        )

        // Effect composer
        this.effectComposer = new EffectComposer(this.instance, renderTarget)
        this.effectComposer.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)

        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(renderPass)

        // Gamma correction pass
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.effectComposer.addPass(gammaCorrectionPass)
        
        // Antialias pass
        if(this.instance.getPixelRatio() === 1 && !this.instance.capabilities.isWebGL2)
        {
            const smaaPass = new SMAAPass()
            this.effectComposer.addPass(smaaPass)

            console.log('Using SMAA')
        }
    }
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )

        // Update effect composer
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    update() {
        // this.instance.render(this.scene, this.camera.instance)

        this.effectComposer.render()
    }
}