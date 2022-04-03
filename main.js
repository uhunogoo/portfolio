import './style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Post processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

// debug
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from './asstes/shaders/vertexShader.glsl?raw'
import fragmentShader from './asstes/shaders/fragmentShader.glsl?raw'



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
            uTime: { value: 0 }
        }
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
        const light1 = new THREE.PointLight( 0xffffff, 1, 10 )
        light1.position.set( 0, 1, 6 )
        const light2 = new THREE.DirectionalLight( 0xffffff, 0.5 )
        light2.position.set( 4, 2, 2 )
        
        const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        this.scene.add(light1, light2, ambientLight)
    }

    /**
     * Camera
     */
    initCamera() {
        this.cameraGroup = new THREE.Group()
        this.scene.add(this.cameraGroup)

        // Base camera
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.z = 4
        this.camera.position.y = 1.5
        this.camera.position.x = 4
        this.camera.lookAt( 0, 0, 0 )
        this.cameraGroup.add(this.camera)
    }

    /**
     * Renderer
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
           canvas: canvas,
           alpha: true,
           antialias: true
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
        this.envMap()
    }



    /**
     * Materials
     */
    loadMaterials() {
        // Material
        this.bottleMaterial = new THREE.MeshStandardMaterial({
            color: this.parameters.blueColor,
            roughness: 0.35,
            metalness: 0.9
        })

        this.dozatorColor = new THREE.MeshStandardMaterial({
            color: this.parameters.clearColor,
            roughness: 0.8,
            metalness: 0.8,
        })

        this.blackMaterial = new THREE.MeshStandardMaterial({
            color: this.parameters.blackMaterialColor,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide,
        })
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.customUniform,
            transparent: true,
            side: THREE.DoubleSide,
            // blending: THREE.AdditiveBlending,
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

                this.group.scale.set(0.6, 0.6, 0.6)
                this.group.position.y = -2
                this.group.rotation.y = -Math.PI * 0.5
            }
        )
        this.scene.add( this.group )
    }
    // Grass
    grass() {
        const countXY = {
            x: 210,
            y: 210,
        }
        const groundReference = new THREE.PlaneBufferGeometry( 8, 8, countXY.x, countXY.y)
        const count = groundReference.attributes.position.count
        groundReference.rotateX(Math.PI * 0.5)
        groundReference.translate(0, 0, 0)
        /**
         * TRIANGLE
         */ 
        // start coordinates
        const grass = new THREE.PlaneBufferGeometry(0.007, 0.25, 1, 3)
        grass.translate( 1, 0.5, 1 );
        const instancedGrassMesh = new THREE.InstancedMesh( grass, this.grassMaterial, count );
        
        const dummy = new THREE.Object3D()
        
        for ( let i = 0 ; i < count; i++ ) {

            dummy.position.set(
                groundReference.attributes.position.getX(i),
                groundReference.attributes.position.getY(i),
                groundReference.attributes.position.getZ(i)
            )
            dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
            dummy.rotation.y = Math.random() * Math.PI * 0.5
            dummy.updateMatrix()
            instancedGrassMesh.setMatrixAt( i, dummy.matrix )
        
        }
        
        instancedGrassMesh.instanceMatrix.needsUpdate = true;

        const groundMesh = new THREE.Mesh(
            groundReference,
            new THREE.MeshBasicMaterial({color: '#004400', side: THREE.DoubleSide})
        )

        this.scene.add( instancedGrassMesh, groundMesh )
        
    }

    // use geometry handler
    geometryHandler() {
        this.loadMaterials()
        // this.model()

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
        this.effectComposer = new EffectComposer(this.renderer)
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

        this.effectComposer.addPass( bokehPass )
    }

    // Use events handler
    eventsHandler() {
        this.resizeEvent()
        this.mouseEvent()

        // effect composer
        this.effectComposerFunction()

        this.tick()
    }

    tick() {
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.customUniform.uTime.value = elapsedTime
        // Animate camera
        // this.camera.lookAt(0, 0, 0)

        // update blade
        // this.group.rotation.y = elapsedTime

        const parallaxX = this.cursor.x *1.25
        const parallaxY = - this.cursor.y * 1.25
        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 3 * deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 3 * deltaTime

        // Render
        this.renderer.render(this.scene, this.camera)
        this.effectComposer.render()

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))
    }
}

window.addEventListener("load", () => {
    new App()
});