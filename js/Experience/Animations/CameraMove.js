// import { Matrix4 } from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class CameraMove {
    constructor ( target ) {        
        // Setup 
        this.target = target        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.cameraEmpty = this.camera.instanceEmpty
        this.mouse = this.experience.mouse
        this.deviceOrientationEvent = this.experience.deviceOrientationEvent
        
        // Defaults
		this.cameraEmptyDefaults = this.cameraEmpty.clone()
        this.deviceOrientationSupported = false
        this.cloudsGroup = this.target.children.find( child => child.name === 'cloudsGroup' )
        this.tempCloudsRotation = this.cloudsGroup.rotation.clone()
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 2        

        // Animations
        this.towerInAnimation = gsap.timeline({
            paused: true,
			onUpdate: () => {
				this.camera.instance.position.copy( this.camera.cameraPosition() )
				this.camera.instance.lookAt( this.camera.cameraLookAt() )
			},
			onComplete: () => { this.cameraEmptyDefaults = this.cameraEmpty.clone() },
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            }
        })

        // Functions
        this.animations()
    }

    animations() {
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
        }, 0)
        this.towerInAnimation.to(this.cameraEmpty.position, {
            keyframes: {
                '35%': {
                    y: this.parameters.cameraY + (this.cameraEmpty.position.y - this.parameters.cameraY) / 2,
                    z: this.parameters.radius,
                    ease: 'power1.in'
                },
                '100%': {
                    y: this.parameters.cameraY * 0.5,
                    z: this.parameters.radius * 1.2,
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
		if ( !this.cameraEmptyDefaults.position.equals( this.cameraEmpty.position ) ) return 
        const tl = gsap.timeline({
			onUpdate: () => {
				this.camera.instance.position.copy( this.camera.cameraPosition() )
				this.camera.instance.lookAt( this.camera.cameraLookAt() )
			}
		})
        tl.fromTo(this.cameraEmpty.rotation, {
            x: this.cameraEmpty.rotation.x,
            y: this.cameraEmpty.rotation.y
        }, {
            x: Math.PI * 0.03 * y,
            y: Math.PI * 0.03 * x,
            ease: 'power1.out',
            duration: 0.6
        }, 0)
        tl.fromTo(this.scene.rotation, {
            x: this.scene.rotation.x,
            y: this.scene.rotation.y
        }, {
            x: Math.PI * 0.03 * y,
            y: Math.PI * 0.03 * x,
            ease: 'power1.out',
            duration: 0.6
        }, 0)
    }
    mouseMove() {        
        // Return if use device orientation 
        if ( this.deviceOrientationSupported ) return

        // Get mouse coordinates 
        const { x, y } = this.mouse       

        this.cameraRotation(-x * 1.4, y)
    }
    deviceOrientation() {
        if (this.deviceOrientationEvent.deviceOrientationTarget) {
            const target = this.deviceOrientationEvent.deviceOrientationTarget
            const gammaAngle = 20
            
            const leftToRight = gsap.utils.clamp(-gammaAngle, gammaAngle,target.gamma )
            const frontToBack = gsap.utils.clamp(10, 55,target.beta )

            this.deviceOrientationSupported = (target.gamma ||target.beta ) ? true : false
            
            this.cameraRotation( (leftToRight / gammaAngle) * 2, - ( frontToBack / 55 ) * 1.5)
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
