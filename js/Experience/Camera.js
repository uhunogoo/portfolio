import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience'
import { fromPairs } from 'lodash-es'

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
        this.resources.on('ready', () => {
            this.animation()
        })


        // call method
        this.setInstance()
        this.setControl()
    }
    setInstance() {
        this.parameters.lookAt = new THREE.Vector3(0, 1, 0)

        // Base camera
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(4, 2, 4)
        this.instance.lookAt( this.parameters.lookAt )
        this.scene.add(this.instance)
        
        console.log(this.instance)
    }
    setControl() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    animation() {
        this.tl = gsap.timeline({
            yoyo: true,
            repeat: -1,
            delay: 3,
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            }
        })
        // step 1
        this.tl.from(this.parameters.lookAt, {
            y: 3,
        }, 0)
        this.tl.from(this.instance.position, {
            x: -2,
            y: 4,
            z: 1,
        }, 0)
        // step 2
        this.tl.to(this.parameters.lookAt, {
            y: '-=1',
        })
        this.tl.to(this.instance.position, {
            x: 2,
            y: 2,
            z: '-=4',
        }, '<')

    }

    update() {
        this.controls.update()
        this.instance.lookAt( this.parameters.lookAt )
    }
}