import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience'

export default class Camera {
    constructor() {
        // Setup
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.resources = this.experience.resources
        
        // Wait for environment
        this.parameters = {}
        this.parameters.cameraY = null
        this.parameters.cameraPosition = new THREE.Vector3(2, 2, 2)
        this.parameters.lookAt = new THREE.Vector3(0, 2.5, 0)

        // call method
        this.setInstance()
        this.setControl()
    }
    setInstance() {
        this.instanceGroup = new THREE.Group()
        this.scene.add(this.instanceGroup)

        // Base camera
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.copy( this.parameters.cameraPosition )
        this.instance.lookAt( this.parameters.lookAt )

        this.parameters.radius = (this.instance.aspect < 1) ? Math.max( 5, 4 / this.instance.aspect ) : 5
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, this.parameters.radius )
        this.parameters.cameraY = Math.max(1.25, ( this.instance.aspect < 1) ? 2 / this.instance.aspect : 1.25)

        console.log(2 / this.instance.aspect)
        console.log(4 / this.instance.aspect)
        // Layers setup
        // this.instance.layers.enable(1)
        
        this.instanceGroup.add(this.instance)
    }
    setControl() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        
        let positionY = Math.max(1.25, ( this.instance.aspect < 1) ? 3 / this.instance.aspect : 1.25)
        positionY = gsap.utils.clamp( 1.25, 3, positionY )

        this.parameters.radius = ( this.instance.aspect < 1) ? 5 / this.instance.aspect : 5
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, this.parameters.radius )

        this.instance.position.y = positionY
        this.instance.position.z = this.parameters.radius
        this.instance.position.x = this.parameters.radius

        this.instance.updateProjectionMatrix()
    }
    
    update() {
        this.controls.update()
        this.instance.lookAt( this.parameters.lookAt )
    }
}