import gsap from 'gsap'
import * as THREE from 'three'

import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'

export default class CameraMove extends EventEmitter {
    constructor ( target ) {
        super()
        
        // Setup 
        this.target = target        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.cameraGroup = this.experience.camera.instanceGroup
        this.mouse = this.experience.mouse

        // Defaults
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75
        this.parameters.radius = 4.5
        this.parameters.cameraY = 0.75

        // Add parameters
        this.previousTime = 0
        this.clock = new THREE.Clock()

        this.animation()
        this.on('animationComplete', () => {
            this.animationComplete = true
        })
    }
    animation() {
        this.tl = gsap.timeline({
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            },
            onComplete: () => {
                this.trigger('animationComplete')
            }
        })
        this.tl.to(this.parameters.lookAt, {
            y: 1,
        }, '<')
        this.tl.to(this.target.rotation, {
            y: Math.PI * this.parameters.angle
        }, '<')
        this.tl.to(this.camera.position, {
            x: this.parameters.radius,
            y: 0.75,
            z: this.parameters.radius,
            ease: 'power3.inOut'
        }, '<')
        this.tl.to(this.target.rotation, {
            y: Math.PI * this.parameters.angle,
            ease: 'circ'
        }, '<+=60%')
    }
    update() {
        if (!this.animationComplete) return
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        const parallaxY = - this.mouse.y * 0.1
        const parallaxX = this.mouse.x * 0.25

        this.cameraGroup.rotation.x += (parallaxY - this.cameraGroup.rotation.x) * 3 * deltaTime
        this.cameraGroup.rotation.y += (parallaxX - this.cameraGroup.rotation.y) * 3 * deltaTime       
    }
}