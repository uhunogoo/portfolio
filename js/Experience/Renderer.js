import * as THREE from 'three' 
import Experience from './Experience'

// Post Processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


export default class Renderer {
    constructor() {
        // Setup
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.scene1 = this.experience.scene1
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
                samples: this.instance.getPixelRatio() === 1 ? 3 : 0
            }
        )
        

        // Effect composer
        this.effectComposer = new EffectComposer(this.instance, renderTarget)
        this.effectComposer.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)

        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(renderPass)

        // Bloom pass
        const unrealBloomPass = new UnrealBloomPass()
        unrealBloomPass.strength = 0.15
        unrealBloomPass.radius = 0.42
        unrealBloomPass.threshold = 0
        unrealBloomPass.enabled = false
        
        if (this.debug.active) {
            this.debugFolder.add(unrealBloomPass, 'enabled')
            this.debugFolder.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
            this.debugFolder.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
            this.debugFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)
        }
        this.effectComposer.addPass(unrealBloomPass)

        // Displacement pass
        const DisplacementShader = {
            uniforms:
            {
                tDiffuse: { value: null },
                uBokhe: { value: null },
            },
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 uBokhe;

                varying vec2 vUv;

                void main()
                {
                    vec2 st = vUv;
                    
                    // Bokhe
                    vec2 newUV = (st - 0.5) / 2.0 + 0.5;
                    float bokhe = 1.0 - length(newUV - 0.5);
                    bokhe = smoothstep( uBokhe.x, uBokhe.y, bokhe);
                    
                    vec4 texture = texture2D(tDiffuse, st);
                    vec3 color = mix( texture.rgb - vec3(1.0) * 0.8, texture.rgb, bokhe );


                    gl_FragColor = vec4(color, 1.0);
                }
            `
        }

        const displacementPass = new ShaderPass(DisplacementShader)
        displacementPass.material.uniforms.uBokhe.value = new THREE.Vector2(0.24, 0.823)
        this.effectComposer.addPass(displacementPass)
        if (this.debug.active) {
            this.debugFolder.add(displacementPass.material.uniforms.uBokhe.value, 'x').min(-1).max(1).step(0.001)
            this.debugFolder.add(displacementPass.material.uniforms.uBokhe.value, 'y').min(-1).max(1).step(0.001)
        }
        
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
        // Update renderer
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )

        // Update effect composer
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    update() {
        // Tick effect composer
        this.effectComposer.render()
    }
}