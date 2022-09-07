import Experience from './Experience'

// Post Processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ACESFilmicToneMapping, CineonToneMapping, CustomToneMapping, LinearFilter, LinearToneMapping, NoToneMapping, ReinhardToneMapping, RGBAFormat, ShaderChunk, sRGBEncoding, Vector2, WebGLRenderer, WebGLRenderTarget } from 'three'


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
        const params = {
            exposure: 1.1,
            toneMapping: 'Custom'
        }
        const toneMappingOptions = {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping,
            Custom: CustomToneMapping
        }

        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            powerPreference: "high-performance"
        })

        this.instance.outputEncoding = sRGBEncoding

        ShaderChunk.tonemapping_pars_fragment = ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
        );

        this.instance.toneMapping = toneMappingOptions[ params.toneMapping ]
        this.instance.toneMappingExposure = params.exposure 
        
        // Debug renderer
        if (this.debug.active) {
            this.debugFolder
                .add( params, 'toneMapping', Object.keys( toneMappingOptions ) )
                .onChange( () => {
                    this.instance.toneMapping = toneMappingOptions[ params.toneMapping ]
                } )


            this.debugFolder
                .add( this.instance, 'toneMappingExposure')
                .min(0)
                .max(2)
                .step(0.001)
        }


        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio( Math.min(this.sizes.pixelRatio, 2) )
    }
    setPostprocess() {
        const renderTarget = new WebGLRenderTarget(
            800,
            600,
            {
                minFilter: LinearFilter,
                magFilter: LinearFilter,
                format: RGBAFormat,
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

        // Bloom pass
        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.strength = 1
        this.unrealBloomPass.radius = 0.05
        this.unrealBloomPass.threshold = 0
        // this.unrealBloomPass.enabled = false
        
        if (this.debug.active) {
            this.debugFolder.add(this.unrealBloomPass, 'enabled').name('bloom enabled')
            this.debugFolder.add(this.unrealBloomPass, 'strength').name('bloom strength').min(0).max(2).step(0.001)
            this.debugFolder.add(this.unrealBloomPass, 'radius').name('bloom radius').min(0).max(2).step(0.001)
            this.debugFolder.add(this.unrealBloomPass, 'threshold').name('bloom threshold').min(0).max(1).step(0.001)
        }
        this.effectComposer.addPass(this.unrealBloomPass)    

        // Displacement pass
        const DisplacementShader = {
            uniforms:
            {
                tDiffuse: { value: null },
                uProgress: { value: 1 },
                uBokhe: { value: null },
                uAspect: { value: this.sizes.width / this.sizes.height }
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
                uniform float uAspect;
                uniform float uProgress;

                varying vec2 vUv;
                
                float random (vec2 st) {
                    return fract(
                        sin( 
                            dot( 
                                st.xy, 
                                vec2( 12.9898,78.233 ) 
                            ) 
                        ) * 43758.5453123 
                    );
                }

                void main()
                {
                    vec2 st = vUv;

                    float scale = 400.0;
                    vec2 scaleXY = vec2( scale, scale / uAspect );

                    vec2 ipos = floor( st * scaleXY );
                    vec2 fpos = fract( st * scaleXY );
                    vec2 xyStep = ipos / scaleXY;
                    
                    // Bokhe
                    vec2 newUV = (st - 0.5) / 2.0 + 0.5;
                    float bokhe = 1.0 - length(newUV - 0.5);
                    bokhe = smoothstep( uBokhe.x, uBokhe.y, bokhe);
                    bokhe = clamp(bokhe, 0.0, 1.0);
                    
                    
                    float noise = random( st + xyStep );
                    noise = clamp(noise, 0.0, 1.0);

                    vec4 texture = texture2D(tDiffuse, st + (1.0 - noise) * 0.0006 );
                    float grey = (texture.r + texture.g + texture.b) / 3.0;
                    float greyMap = 1.0 - floor(grey);

                    vec3 color = mix( texture.rgb, texture.rgb - (1.0 - bokhe) * 0.8, greyMap );
                    color = mix( color, color - (noise * 0.1), greyMap );
                    // color = mix( color, color + vec3(grey, 0.0, 0.0) * 0.2, greyMap );
                    color = clamp( color, vec3(0.0), vec3(1.0) );

                    gl_FragColor = vec4( color, 1.0);
                }
            `
        }
        
        
        this.displacementPass = new ShaderPass(DisplacementShader)
        // this.displacementPass.enabled = false
        this.displacementPass.material.uniforms.uBokhe.value = new Vector2(0.4, 0.823)
        this.effectComposer.addPass(this.displacementPass)
        
        // Debug renderer
        if (this.debug.active) {
            this.debugFolder.add(this.displacementPass.material.uniforms.uBokhe.value, 'x').name('bokeh width').min(-1).max(1).step(0.001)
            this.debugFolder.add(this.displacementPass.material.uniforms.uBokhe.value, 'y').name('bokeh height').min(-1).max(1).step(0.001)
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

        // Update bokhe shader
        this.displacementPass.material.uniforms.uAspect.value = this.sizes.width / this.sizes.height
    }
    update() {
        // Tick effect composer
        this.effectComposer.render()
    }
}