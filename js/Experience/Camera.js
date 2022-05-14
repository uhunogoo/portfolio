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
    }
    setInstance() {
        this.instanceGroup = new THREE.Group()
        this.scene.add(this.instanceGroup)
        // Base camera
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1, 3, 1)
        
        this.instance.updateMatrix()
        this.instance.updateProjectionMatrix()
        
        this.parameters.lookAt = new THREE.Vector3(0, this.instance.position.y, 0)
        this.instance.lookAt( this.parameters.lookAt )
        
        this.instanceGroup.add(this.instance)
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    
    update() {
        this.instance.lookAt( this.parameters.lookAt )
    }
}