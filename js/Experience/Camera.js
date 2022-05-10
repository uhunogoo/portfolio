import * as THREE from 'three'
// import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

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
        // this.setControl()
    }
    setInstance() {
        this.parameters.lookAt = new THREE.Vector3(0, 3, 0)

        // Base camera
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1, 3, 1)
        this.instance.lookAt( this.parameters.lookAt )
        this.scene.add(this.instance)
    }
    setControl() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target = new THREE.Vector3( 0, this.instance.position.y, 0 )
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // this.controls.update()
        if(this.instance) {
            this.instance.lookAt( this.parameters.lookAt )
        }
    }
}