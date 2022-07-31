import gsap from 'gsap'
import * as THREE from 'three'

import Experience from '../Experience'

export default class CameraMove {
    constructor ( target ) {        
        // Setup 
        this.target = target        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.cameraGroup = this.experience.camera.instanceGroup
        this.mouse = this.experience.mouse

        // Defaults
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75
        this.parameters.cameraY = ( this.camera.aspect < 1) ? Math.max( 1.25, 2 / this.camera.aspect ) : 1.25

        // Add parameters
        this.previousTime = 0
        this.clock = new THREE.Clock()

        // Animations
        this.towerInAnimation = gsap.timeline({
            paused: true,
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            },
            onComplete: () => {
                this.animationComplete = true
            }
        })
        this.animation()
    }
    animation() {
        this.towerInAnimation.to(this.parameters.lookAt, {
            keyframes: {
                '50%': {
                    y: 0.4,
                    ease: 'power1'
                },
                '100%': {
                    y: 1,
                    ease: 'power1.in'
                }
            }
        })
        this.towerInAnimation.to(this.target.rotation, {
            keyframes: {
                '35%': {
                    y: Math.PI * this.parameters.angle * 0.45,
                    ease: 'power1.in'
                },
                '100%': {
                    y: Math.PI * this.parameters.angle,
                    ease: 'back(1.05).out'
                }
            }
        }, '<')
        this.towerInAnimation.to(this.scene.rotation, {
            keyframes: {
                '25%': {
                    z: -Math.PI * 0.1,
                    ease: 'back(1.2)'
                },
                '100%': {
                    z: 0,
                    ease: 'back(3.4)'
                }
            }
        }, '<')
        this.towerInAnimation.to(this.camera.position, {
            keyframes: {
                '30%': {
                    x: this.parameters.radius * 0.5,
                    y: this.parameters.cameraY + (this.camera.position.y - this.parameters.cameraY) / 2,
                    z: this.parameters.radius * 0.5,
                    ease: 'power2'
                },
                '100%': {
                    x: this.parameters.radius,
                    y: this.parameters.cameraY,
                    z: this.parameters.radius,
                    ease: 'back(2.5).in'
                }
            },
        }, '<')
    }
    update() {
        if (!this.animationComplete) return
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        const parallaxY = - this.mouse.y * 0.1
        const parallaxX = this.mouse.x * 0.05

        this.cameraGroup.rotation.x += (parallaxY - this.cameraGroup.rotation.x) * 3 * deltaTime
        this.cameraGroup.rotation.y += (parallaxX - this.cameraGroup.rotation.y) * 3 * deltaTime       
    }
}