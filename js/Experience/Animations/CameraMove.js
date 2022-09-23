// import { Matrix4 } from 'three'
import gsap from 'gsap'
import { QuadraticBezierCurve3, Vector3 } from 'three'

import Experience from '../Experience'

export default class CameraMove {
    constructor ( target ) {        
        // Setup 
        this.target = target        
        this.experience = new Experience()
		this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.cameraEmpty = this.camera.instanceEmpty
        this.mouse = this.experience.mouse
		this.points = this.experience.points
        this.deviceOrientationEvent = this.experience.deviceOrientationEvent
        
        // Defaults
		this.cameraMove = { 
			progress: 0.0,
			rotateXY: { x: 0, y: 0 }, 
			angle: {
                lineAnimation: new Vector3(),
                mouseAnimation: new Vector3()
            }
		}
		this.angleScale = 0
		this.cameraEmptyDefaults = this.cameraEmpty.clone()
        this.deviceOrientationSupported = false
        this.cloudsGroup = this.target.children.find( child => child.name === 'cloudsGroup' )
        this.tempCloudsRotation = this.cloudsGroup.rotation.clone()
        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 2   
		
		this.cameraAnimationVariation = {
			curves: {},
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
				this.cameraEmptyDefaults.position.copy( this.cameraEmpty.position.clone() )
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
				const pathLength = target[0].pathLength / 5
				const path = target[0].points

				// Animation
				const tl = gsap.timeline({
					onUpdate: () => {
						const t = this.cameraMove.progress
						const ID = Math.round(t * (path.length - 1 ))
						
						this.cameraEmpty.position.copy( path[ ID ] )
					}
				})
				tl.to( this.cameraMove, {
					progress: 1,
					duration: 1 + pathLength,
					ease: 'power1.in'
				}, 0)
				tl.to( this.cameraMove.angle.lineAnimation, {
					y: parameters.y,
					x: parameters.x,
					duration: 1 + pathLength,
					ease: 'power1.in'
				}, 0)

                return tl
            }
        })


        // Functions
        this.animations()
		this.cameraRotationTimelines()
    }
	animateCamera(id) {
		const target = {
			pathLength: this.cameraAnimationVariation.curves.pathLength[id],
			points: this.cameraAnimationVariation.curves.curvePoints[id]
		}
		const tl = gsap.timeline()
		tl.cameraMoveAnimation( 
			target, 
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
		curve1Coords.push( this.cameraEmptyDefaults.position.clone() )
		curve1Coords.push( curv1Point2 )
		curve1Coords.push( this.points.list[0].position )
		
		// second curve
		const curv2Point2 = this.points.list[1].position.clone()
		curv2Point2.x = 0.1
		curv2Point2.y = 0.5
		curv2Point2.z += 0.3
		curve2Coords.push( this.cameraEmptyDefaults.position.clone() )
		curve2Coords.push( curv2Point2 )
		curve2Coords.push( this.points.list[1].position )
		
		
		//Create a closed wavey loop
		this.curve1 = new QuadraticBezierCurve3( ...curve1Coords )
		this.curve2 = new QuadraticBezierCurve3( ...curve2Coords )

		this.cameraAnimationVariation.curves.pathLength = [
			this.curve1.getLength(),
			this.curve2.getLength()
		]
		this.cameraAnimationVariation.curves.curvePoints = [
			this.curve1.getPoints( 300 ),
			this.curve2.getPoints( 300 )
		]
		
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
    cameraRotationCalculation() {
        const startRotation = this.cameraEmptyDefaults.rotation.clone()

        const mouseMoveRotation = this.cameraMove.angle.mouseAnimation
        const lineMoveRotation = this.cameraMove.angle.lineAnimation	
		
        const combineBothMoveX = mouseMoveRotation.x + lineMoveRotation.x
        const combineBothMoveY = mouseMoveRotation.y + lineMoveRotation.y
		
        this.cameraEmpty.rotation.x = startRotation.x + combineBothMoveX
        this.cameraEmpty.rotation.y = startRotation.y + combineBothMoveY
    }
    cameraRotationTimelines() {
		this.rotateCameraY = gsap.timeline({
			paused: true,
			defaults: {
				ease: 'none',
				duration: 1
			}
		})
        this.rotateCameraY.fromTo(this.cameraMove.angle.mouseAnimation, {
            y: () => 0.18 + this.angleScale
		},{
			y: () => (0.18 + this.angleScale) * -1 
        })
		this.rotateCameraY.fromTo(this.scene.rotation, {
            y: Math.PI * 0.002,
		},{
            y: - Math.PI * 0.002,
        }, 0)


		this.rotateCameraX = gsap.timeline({
			paused: true,
			defaults: {
				ease: 'none',
				duration: 1
			}
		})
        this.rotateCameraX.fromTo(this.cameraMove.angle.mouseAnimation, {
            x: - Math.PI * 0.05,
		},{
            x: Math.PI * 0.05,
        })
		this.rotateCameraX.fromTo(this.scene.rotation, {
            x: - Math.PI * 0.002,
		},{
            x: Math.PI * 0.002,
        }, 0)      
    }
	cameraRotationAnimation( x, y ) {	
		const update = () => {
			const {x, y} = this.cameraMove.rotateXY
			this.rotateCameraX.progress( x )
			this.rotateCameraY.progress( y )
		}
		gsap.to(this.cameraMove.rotateXY, {
			x: (y + 1) / 2,
			y: (x + 1) / 2,
			immediateRender: true,
			ease: 'sine',
			duration: 0.65,
			onUpdate: update
		})
	}
    mouseMove() {     
        // Return if use device orientation 
        if ( !this.deviceOrientationSupported ) {
			// Get mouse coordinates
			const { x, y } = this.mouse
			
			this.angleScale = 1.0 - Math.min(this.sizes.width / 1000, 1)
			this.cameraRotationAnimation( x, y )
		}

    }
	resize() {
		this.rotateCameraY.kill()
		this.rotateCameraX.kill()
		this.cameraRotationTimelines()
	}
    deviceOrientation() {		
        if (this.deviceOrientationEvent.deviceOrientationTarget) {
			if( typeof this.deviceOrientationEvent.deviceOrientationTarget.gamma === 'number') {
				const gammaAngle = 20
				const target = this.deviceOrientationEvent.deviceOrientationTarget
				this.deviceOrientationSupported = (target.gamma ||target.beta ) ? true : false
				
				const leftToRight = gsap.utils.clamp(-gammaAngle, gammaAngle, target.gamma )
				const frontToBack = gsap.utils.clamp(10, 55,target.beta )
	
				
				const x = - leftToRight / gammaAngle
				const y = frontToBack / 55
				
				this.angleScale = 1.0 - Math.min(this.sizes.width / 1000, 1)
				this.cameraRotationAnimation( x, y )
			}
        }
    }
    update() {
		this.updateCamera()
		this.cameraRotationCalculation()
    }
}
