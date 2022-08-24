import gsap from 'gsap'
import { Clock, Matrix4 } from 'three'

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
        this.deviceOrientationSupported = false
        this.cloudsGroup = target.children.find( child => child.name === 'cloudsGroup' )
        this.tempMouseCoords = {
            x: 0,
            y: 0
        }
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75

        // Add parameters
        this.previousTime = 0
        this.clock = new Clock()

        // Animations
        this.towerInAnimation = gsap.timeline({
            paused: true,
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            }
        })


        this.rotatioMatrix = new Matrix4()
        this.rotatioMatrix.copy( this.camera.matrixWorld )
        this.rotatioMatrix.makeRotationY( Math.PI * 0.25)


        // Functions
        this.animations()
        this.deviceOrientation()
    }
    animations() {
        this.towerInAnimation.to(this.parameters.lookAt, {
            keyframes: {
                '50%': {
                    y: 0.4,
                    ease: 'power1.out'
                },
                '100%': {
                    y: 1,
                    ease: 'power2.in'
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
                    ease: 'power2.out'
                }
            }
        }, '<')
        this.towerInAnimation.to(this.camera.position, {
            keyframes: {
                '35%': {
                    x: this.parameters.radius * 0.5,
                    y: this.parameters.cameraY + (this.camera.position.y - this.parameters.cameraY) / 2,
                    z: this.parameters.radius * 0.5,
                    ease: 'power1.in'
                },
                '100%': {
                    x: this.parameters.radius,
                    y: this.parameters.cameraY,
                    z: this.parameters.radius,
                    ease: 'power2.out'
                }
            },
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
    }
    cameraRotation(x, y) {
        const tl = gsap.timeline()
        tl.fromTo(this.cameraGroup.rotation, {
            x: this.cameraGroup.rotation.x,
            y: this.cameraGroup.rotation.y
        }, {
            y: Math.PI * 0.03 * x,
            x: - Math.PI * 0.03 * y,
            ease: 'power1.out',
            duration: 0.6
        }, 0)
        tl.fromTo(this.cloudsGroup.rotation, {x: this.cloudsGroup.rotation.x}, {
            x: x * 0.05,
        }, 0)
    }
    mouseMove() {        
        // Return if use device orientation 
        if ( this.deviceOrientationSupported ) return

        // Get mouse coordinates 
        const { x, y } = this.mouse       

        this.cameraRotation(x, y)
    }
    deviceOrientation() {
        if (window.DeviceOrientationEvent) {  
            window.addEventListener('deviceorientation', (event) => {
                const leftToRight = gsap.utils.clamp(-45, 45, event.gamma )
                const frontToBack = gsap.utils.clamp(10, 55, event.beta )

                this.deviceOrientationSupported = ( event.gamma || event.beta ) ? true : false
                
                this.cameraRotation( - leftToRight * 0.085, - frontToBack * 0.05)
            })
        }
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