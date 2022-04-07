import './style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Post processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

// shader pass
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// debug
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import vertexShader from './asstes/shaders/grass/vertexShader.glsl?raw'
import fragmentShader from './asstes/shaders/grass/fragmentShader.glsl?raw'

import swordVertexShader from './asstes/shaders/sword/vertexShader.glsl?raw'
import swordFragmentShader from './asstes/shaders/sword/fragmentShader.glsl?raw'



/**
 * Contants
 */
const canvas = document.querySelector('canvas.webgl')


/**
 * App
 */
class App {
    constructor() {
        this.parameters = {
            time: 0,
            blackMaterialColor: '#222222',
            whiteColor: '#e0cdcd',
            blueColor: '#2d2d2d',
            clearColor: '#FF5733'
        }
        this.customUniform = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#38a380') },
            uColor2: { value: new THREE.Color('#664600') },
        }
        this.swordUniform = {
            uTime: { value: 0 },
            uPixelRatio: { value: 0 }
        }
        console.log(this.customUniform.uColor1.value)
        this.sizes = {
            width: document.documentElement.clientWidth,
            height: window.innerHeight
        }
        this.cursor = new THREE.Vector2(0, 0)
        this.clock = new THREE.Clock()
        this.previousTime = 0

        // THREE DEFAULTS
        this.scene = new THREE.Scene()
        this.gltfLoader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader()

        // run
        this.initHandler()
        this.geometryHandler()
        this.eventsHandler()
    }

    /**
     * Lights
     */
    initLight() {
        const light1 = new THREE.PointLight( 0xffffff, 1, 40, 1 )
        light1.position.set( 0, 1, 8 )
        const light2 = new THREE.DirectionalLight( 0xffffff, 1 )
        light2.position.set( 4, 2, 2 )
        
        const ambientLight = new THREE.AmbientLight('#ffffff', 1)
        this.scene.add(light1, ambientLight)
    }

    /**
     * Camera
     */
    initCamera() {
        this.cameraGroup = new THREE.Group()
        this.scene.add(this.cameraGroup)

        // Base camera
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.z = 5
        this.camera.position.y = 1
        this.camera.position.x = 5
        
        this.cameraGroup.add(this.camera)


        // Controls
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true

        // Fog
        // const fog = new THREE.Fog('#262837', 1, 5)
        // this.scene.fog = fog
    }

    /**
     * Renderer
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
           canvas: canvas,
           alpha: true,
           antialias: true,
       })
    //    this.renderer.outputEncoding = THREE.sRGBEncoding
       this.renderer.setSize(this.sizes.width, this.sizes.height)
       this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    /**
     * Enviromantal map
     */
    envMap() {
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const environmentMap = cubeTextureLoader.load([
            '/asstes/textures/px.png?url',
            '/asstes/textures/nx.png?url',
            '/asstes/textures/py.png?url',
            '/asstes/textures/ny.png?url',
            '/asstes/textures/pz.png?url',
            '/asstes/textures/nz.png?url'
        ])
        console.log(environmentMap)

        this.scene.background = environmentMap
    }

    // use inits handler
    initHandler() {
        this.initLight()
        this.initCamera()
        this.initRenderer()
        // this.envMap()
    }



    /**
     * Materials
     */
    loadMaterials() {
        // Material
        this.bottleMaterial = new THREE.MeshStandardMaterial({
            color: '#e5e5e5',
            roughness: 0.7,
            roughnessMap: this.textureLoader.load( '/asstes/textures/Metal_metallicRoughness.png?url' ),
            normalMap: this.textureLoader.load( '/asstes/textures/Metal_normal.png?url' ),
            // map: this.textureLoader.load( '/asstes/textures/Metal_baseColor.png?url' ),
            metalness: 0.7
        })
        this.bottleMaterial.generateMipmaps = false
        this.bottleMaterial.minFilter = THREE.NearestFilter

        this.dozatorColor = new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0.2,
            roughnessMap: this.textureLoader.load( '/asstes/textures/Wood_metallicRoughness.png?url' ),
            map: this.textureLoader.load( '/asstes/textures/Wood_baseColor.jpg?url' ),
        })

        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: this.parameters.blackMaterialColor,
            roughness: 0.6,
            metalness: 0.6,
            roughnessMap: this.textureLoader.load( '/asstes/textures/Wood_metallicRoughness.png?url' ),
            // side: THREE.DoubleSide,
        })
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.customUniform,
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader,
            fragmentShader,
        })
        
    }

    // Model
    model() {
        this.group = new THREE.Group()
        
        this.gltfLoader.load(
            // swordModel,
			'/asstes/geometry/knife-2.glb?url',
            (model) => {
                const garda = model.scene.children.find( child => child.name === 'garda')
                const knife = model.scene.children.find( child => child.name === 'knife')
                const handle = model.scene.children.find( child => child.name === 'handle')
                
                // compute normals
                garda.geometry.computeVertexNormals()
                knife.geometry.computeVertexNormals()
                handle.geometry.computeVertexNormals()
                
                // apply materials
                garda.material = this.blackMaterial.clone()
                knife.material = this.bottleMaterial.clone()
                handle.material = this.dozatorColor.clone()

                this.group.add(knife, handle, garda)

                this.group.scale.set(0.3, 0.3, 0.3)
                this.group.position.y = 1
                // this.group.position.y = -1.55
                // this.group.position.z = 2.3
                // this.group.position.x = 2.3
                this.group.rotation.y = -Math.PI * 0.5
            }
        )
        this.scene.add( this.group )
    }
    // Grass
    grass() {
        const countXY = {
            x: 400,
            y: 400,
        }
        const groundReference = new THREE.PlaneBufferGeometry( 10, 10, countXY.x, countXY.y)
        const count = groundReference.attributes.position.count
        groundReference.rotateX(Math.PI * 0.5)
        /**
         * TRIANGLE
         */ 
        // start coordinates
        // const grass = new THREE.PlaneBufferGeometry(0.02, 0.25, 1, 3)
        const grass = new THREE.PlaneBufferGeometry(0.02, 0.25, 1, 1)
        grass.translate( 0, 0.125, 0 );
        const instancedGrassMesh = new THREE.InstancedMesh( grass, this.grassMaterial, count );
        
        const dummy = new THREE.Object3D()
        
        for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5
            dummy.position.set(
                groundReference.attributes.position.getX(i) + (Math.random() - 0.5),
                0,
                groundReference.attributes.position.getZ(i) + (Math.random() - 0.5)
            )
            dummy.scale.setScalar( scale );
            dummy.rotation.y = Math.random() * Math.PI * 0.5
            dummy.updateMatrix()
            instancedGrassMesh.setMatrixAt( i, dummy.matrix )
        
        }
        
        instancedGrassMesh.instanceMatrix.needsUpdate = true;

        const groundMaterial = new THREE.MeshBasicMaterial({color: '#004400', side: THREE.DoubleSide})
        const groundMesh = new THREE.Mesh(
            groundReference,
            groundMaterial
        )

        // debug
        // customUniform
        const gui = new GUI();
        gui.addColor( this.customUniform.uColor1, 'value').onChange( () => {
            this.grassMaterial.uniforms.uColor1.value = this.customUniform.uColor1.value
        })
        gui.addColor( this.customUniform.uColor2, 'value').onChange( () => {
            this.grassMaterial.uniforms.uColor2.value = this.customUniform.uColor2.value
        })
        // gui.add( effectController, 'aperture' ).step(0.001).min(0).max(10).onChange( matChanger )
        // gui.add( effectController, 'maxblur').step(0.001).min(0).max(2).onChange( matChanger )
        gui.close()

        // ground deformation
        groundMaterial.onBeforeCompile = (shader) =>
        {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                    #include <begin_vertex>
                    transformed.y = (1.0 - smoothstep( 0.0, 2.5, length( transformed.xz * 0.5) )) * 1.25;
                `
            )
        }

        this.scene.add( instancedGrassMesh, groundMesh )
        
    }

    particlesArondSword() {
        // set pixelRatio
        this.swordUniform.uPixelRatio.value = this.renderer.getPixelRatio()
        // console.log();

        // generate particles around the sword
        const geometry = new THREE.CylinderBufferGeometry(0.4, 0.15, 0.5, 4, 10)
        const material = new THREE.ShaderMaterial({
            uniforms: this.swordUniform,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: swordVertexShader,
            fragmentShader: swordFragmentShader
        })

        const mesh = new THREE.Points( geometry, material )
        mesh.position.y = 1.7
        this.scene.add(mesh)

    }

    // use geometry handler
    geometryHandler() {
        this.loadMaterials()
        // sword
        this.model()
        this.particlesArondSword()

        // generate grass
        this.grass()
        
    }


    /**
     * Resize
     */
    resizeEvent() {
        window.addEventListener('resize', () =>
        {
            if (this.sizes.width !== document.documentElement.clientWidth) {
                // Update sizes
                this.sizes.width = document.documentElement.clientWidth
                this.sizes.height = window.innerHeight
        
                // Update camera
                this.camera.aspect = this.sizes.width / this.sizes.height
                this.camera.updateProjectionMatrix()
        
                // Update renderer
                this.renderer.setSize(this.sizes.width, this.sizes.height)
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

                // this.effectComposer.setSize(this.sizes.width, this.sizes.height)
            }
        })
    }

    /**
     * Mouse move
     */
    mouseEvent() {
        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5
        })
    }

    effectComposerFunction() {
        // if( this.renderer.getPixelRatio() === 2 ) 
        // {
        //     const smaaPass = new SMAAPass()
        //     this.effectComposer.addPass( smaaPass )
        // }

        const renderTarget = new THREE.WebGLMultisampleRenderTarget( 800, 600, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            encoding: THREE.sRGBEncoding,
        })

        this.effectComposer = new EffectComposer(this.renderer, renderTarget)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


        const renderPass = new RenderPass(this.scene, this.camera)
        this.effectComposer.addPass(renderPass)

        // bokeh
        const bokehPass = new BokehPass( this.scene, this.camera, {
            focus: 60,
            aperture: 6,
            maxblur: 0.01,

            width: this.sizes.width,
            height: this.sizes.height
        })


        const postprocessing = {}
        postprocessing.bokeh = bokehPass
        const effectController = {
            focus: 60,
            aperture: 6,
            maxblur: 0.01
        }    
        const matChanger = function ( ) {
            postprocessing.bokeh.uniforms[ 'focus' ].value = effectController.focus
            postprocessing.bokeh.uniforms[ 'aperture' ].value = effectController.aperture * 0.00001
            postprocessing.bokeh.uniforms[ 'maxblur' ].value = effectController.maxblur
        }

        const gui = new GUI();
        gui.add( effectController, 'focus').step(0.001).min(0).max(80).onChange( matChanger )
        gui.add( effectController, 'aperture' ).step(0.001).min(0).max(10).onChange( matChanger )
        gui.add( effectController, 'maxblur').step(0.001).min(0).max(2).onChange( matChanger )
        gui.close()

        matChanger()
        
        
        // shader PASS
        const alphaShader = {
            uniforms: {
                tDiffuse: { value: null },
                u_normal: { value: null }
            },
            vertexShader: `
                varying vec2 vUv; 
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                // uniform sampler2D u_normal;
                
                varying vec2 vUv; 

                void main() {
                    vec2 st = vUv;

                    vec4 texture = texture2D( tDiffuse, st );

                    gl_FragColor = vec4(texture);
                }
            `
        }
        const displacementPass = new ShaderPass( alphaShader )
        this.effectComposer.addPass( displacementPass )

    }

    // Use events handler
    eventsHandler() {
        this.resizeEvent()
        this.mouseEvent()

        // effect composer
        // this.effectComposerFunction()

        this.tick()
    }

    tick() {
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.customUniform.uTime.value = elapsedTime
        this.swordUniform.uTime.value = elapsedTime
        // Animate camera
        // this.camera.lookAt(0, 1.5, 0)

        // update blade
        // this.group.rotation.y = elapsedTime

        // const parallaxX = this.cursor.x *1.25
        // const parallaxY = - this.cursor.y * 1.25
        // this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 3 * deltaTime
        // this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 3 * deltaTime

        // Render
        this.renderer.render(this.scene, this.camera)
        // this.effectComposer.render()

        // Update controls
        this.controls.update()

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))
    }
}

window.addEventListener("load", () => {
    new App()
});