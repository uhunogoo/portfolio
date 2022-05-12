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

        // call method
        this.setInstance()
        this.setControl()
    }
    setInstance() {
        
        // Base camera
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1, 3, 1)
        this.scene.add(this.instance)

        this.instance.updateMatrix()
        this.instance.updateProjectionMatrix()

        this.parameters.lookAt = new THREE.Vector3(0, this.instance.position.y, 0)


    }
    setControl() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target = this.parameters.lookAt
        this.controls.maxPolarAngle = Math.PI * 0.53
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    
    update() {
        this.controls.update()
    }
}