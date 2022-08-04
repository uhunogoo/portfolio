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
        this.cloudsGroup = target.children.find( child => child.name === 'cloudsGroup' )
        this.tempMouseCoords = {
            x: 0,
            y: 0
        }
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75

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


        this.rotatioMatrix = new THREE.Matrix4()
        this.rotatioMatrix.copy( this.camera.matrixWorld )
        this.rotatioMatrix.makeRotationY( Math.PI * 0.25)

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
    mouseMove() {
        // Play when animation was complete 
        if (!this.animationComplete) return

        // Get mouse coordinates 
        const { x, y } = this.mouse       

        // Camera animation
        gsap.fromTo(this.cameraGroup.rotation, {
            x: this.cameraGroup.rotation.x,
            y: this.cameraGroup.rotation.y
        }, {
            y: Math.PI * 0.03 * x,
            x: - Math.PI * 0.03 * y,
            ease: 'power1.out',
            duration: 0.3
        })
    }
    update() {
        // let vector = new THREE.Vector3()
        // this.camera.getWorldPosition(vector)
        // vector.applyMatrix4(this.rotatioMatrix)
        // vector.negate()

        // this.cloudsGroup.position.x = vector.x
        // this.cloudsGroup.position.z = vector.z
        // this.cloudsGroup.position.y = vector.y + 2
        // this.cloudsGroup.lookAt( 0, 0, 0 )
    }
}