import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
        this.camera.position.z = 6
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
    // use inits handler
    initHandler() {
        this.initLight()
        this.initCamera()
        this.initRenderer()
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
    }

    // Model
    model() {
        this.group = new THREE.Group()
        this.gltfLoader.load(
            'knife-2.glb',
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
            }
        )
        this.scene.add( this.group )
    }
    // use geometry handler
    geometryHandler() {
        this.loadMaterials()
        this.model()
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

    // Use events handler
    eventsHandler() {
        this.resizeEvent()
        this.mouseEvent()
        this.tick()
    }

    tick() {
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        // Animate camera
        this.camera.lookAt(0, 0, 0)

        // update blade
        this.group.rotation.y = elapsedTime

        const parallaxX = this.cursor.x * 0.75
        const parallaxY = - this.cursor.y * 0.75
        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime

        // Render
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))
    }
}

window.addEventListener("load", () => {
    new App()
});