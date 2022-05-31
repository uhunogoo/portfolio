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
        this.parameters.cameraPosition = new THREE.Vector3(1, 3, 1)
        this.parameters.lookAt = new THREE.Vector3(0, 3, 0)

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

        // Layers setup
        this.instance.layers.disable(0)
        this.instance.layers.enable(1)
        
        this.instanceGroup.add(this.instance)
    }
    setControl() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    
    update() {
        this.controls.update()
        this.instance.lookAt( this.parameters.lookAt )
    }
}