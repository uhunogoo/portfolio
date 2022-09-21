// import { Matrix4 } from 'three'
import gsap from 'gsap'
import { QuadraticBezierCurve3 } from 'three'

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
		this.points = this.experience.points
        this.deviceOrientationEvent = this.experience.deviceOrientationEvent
        
        // Defaults
		this.cameraMove = { 
			progress: 0.0, 
			angle: 0
		}
		this.cameraEmptyDefaults = this.cameraEmpty.clone()
        this.deviceOrientationSupported = false
        this.cloudsGroup = this.target.children.find( child => child.name === 'cloudsGroup' )
        this.tempCloudsRotation = this.cloudsGroup.rotation.clone()
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 2   
		
		this.cameraAnimationVariation = {
			curves: [],
			animationParameters: [
				{ x: -Math.PI * 0.2, y: -Math.PI * 0.03 },
				{ x: -Math.PI * 0.1, y: Math.PI * 0.5},
			]
		}
        // Animations
        this.towerInAnimation = gsap.timeline({
            paused: true,
			// onUpdate: () => this.updateCamera(),
			onComplete: () => { 
				this.cameraEmptyDefaults = this.cameraEmpty.clone()
				this.cameraCurve()
				
			},
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            }
        })

		gsap.registerEffect({
            name: "cameraMoveAnimation",
            extendTimeline:true,
            effect: (target, parameters) => {
				// Defaults 
				const length = target[0].getLength() / 5
				const path = target[0].getPoints( 400 )

				// Animation
				const tl = gsap.timeline({
					onUpdate: () => {
						const t = this.cameraMove.progress
						const ID = Math.round(t * (path.length - 1 ))
						
						// this.cameraEmpty.position.lerp( path[ ID ], 0.7 )
						this.cameraEmpty.position.copy( path[ ID ] )
					}
				})
				tl.to( this.cameraMove, {
					progress: 1,
					duration: 1 + length,
					ease: 'power1.inOut'
				}, 0)
				tl.to( this.cameraEmpty.rotation, {
					y: parameters.y,
					x: parameters.x,
					overwrite: true,
					duration: 1 + length,
					ease: 'power1.inOut'
				}, 0)

                return tl
            }
        })


        // Functions
        this.animations()
    }
	animateCamera(id) {
		const tl = gsap.timeline()
		tl.cameraMoveAnimation( 
			this.cameraAnimationVariation.curves[id], 
			this.cameraAnimationVariation.animationParameters[id] 
		)
		return tl
	}
	updateCamera() {
		this.camera.instance.position.copy( this.camera.cameraPosition() )
		this.camera.instance.lookAt( this.camera.cameraLookAt() )
	}
	cameraCurve() {
		const curve1Coords = []
		const curve2Coords = []
		// First curve
		const curv1Point2 = this.points.list[1].position.clone()
		curv1Point2.x = 0.0
		curv1Point2.y = 0.0
		curv1Point2.z += 0.5
		curve1Coords.push( this.cameraEmptyDefaults.position )
		curve1Coords.push( curv1Point2 )
		curve1Coords.push( this.points.list[0].position )
		
		// second curve
		const curv2Point2 = this.points.list[1].position.clone()
		curv2Point2.x = 0.1
		curv2Point2.y = 0.5
		curv2Point2.z += 0.3
		curve2Coords.push( this.cameraEmptyDefaults.position )
		curve2Coords.push( curv2Point2 )
		curve2Coords.push( this.points.list[1].position )
		
		
		//Create a closed wavey loop
		this.curve1 = new QuadraticBezierCurve3( ...curve1Coords )
		this.curve2 = new QuadraticBezierCurve3( ...curve2Coords )
		
		this.cameraAnimationVariation.curves.push( this.curve1 )
		this.cameraAnimationVariation.curves.push( this.curve2 )

		// Show for debug
		// this.points1 = this.curve1.getPoints( 50 )
		// this.points2 = this.curve2.getPoints( 50 )
		
		// const lineMaterial = new LineBasicMaterial( { color: 0xff0000 } )
		// const lineGeometry1 = new Geometry().setFromPoints( this.points1 )
		// const lineGeometry2 = new Geometry().setFromPoints( this.points2 )

		// const curveObject1 = new Line( lineGeometry1, lineMaterial )
		// const curveObject2 = new Line( lineGeometry2, lineMaterial )
		// this.scene.add( curveObject1, curveObject2 )
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
        const tl = gsap.timeline()
        tl.fromTo(this.cameraEmpty.rotation, { x: this.cameraEmpty.rotation.x, y: this.cameraEmpty.rotation.y },{
            x: Math.PI * 0.03 * y,
            y: Math.PI * 0.05 * x,
            ease: 'power3.out',
            duration: 0.9
        }, 0)
        tl.fromTo(this.scene.rotation, {
			x: this.scene.rotation.x,
            y: this.scene.rotation.y
        }, {
			x: Math.PI * 0.002 * y,
            y: Math.PI * 0.002 * x,
            ease: 'sine.out',
            duration: 0.6
        }, 0)
    }
    mouseMove() {        
        // Return if use device orientation 
        if ( this.deviceOrientationSupported ) return

        // Get mouse coordinates 
        const { x, y } = this.mouse       

        this.cameraRotation(-x * 1.3, y * 1.1)
    }
    deviceOrientation() {
        if (this.deviceOrientationEvent.deviceOrientationTarget) {
            const target = this.deviceOrientationEvent.deviceOrientationTarget
            const gammaAngle = 20
            
            const leftToRight = gsap.utils.clamp(-gammaAngle, gammaAngle,target.gamma )
            const frontToBack = gsap.utils.clamp(10, 55,target.beta )

            this.deviceOrientationSupported = (target.gamma ||target.beta ) ? true : false
            
            this.cameraRotation( (leftToRight / gammaAngle) * 2, -( frontToBack / 55 ) * 1.5)
        }
    }
    update() {
		this.updateCamera()
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
