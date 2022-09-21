import { Group, Vector3, PerspectiveCamera, BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

import Experience from './Experience'

export default class Camera {
    constructor() {
        // Setup
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.scene1 = this.experience.scene1
        this.canvas = this.experience.canvas
        this.resources = this.experience.resources
        
        // Wait for environment
        this.parameters = {}
        this.parameters.radius = 5
        this.parameters.cameraY = 1.25
        this.parameters.position = new Vector3(0, 2, 2)
		this.parameters.cameraPosition = new Vector3(0, 0.4, 1)
        this.parameters.lookAt = new Vector3(0, 0, 0)

        // call method
		this.setCamenraEmpty()
        this.setInstance()
    }
    calculateY( aspect ) { 
        return Math.max(1.25, ( aspect < 1) ? 2 / aspect : 1.25) 
    }
	setCamenraEmpty() {
		const geometry = new BoxGeometry(0.2, 0.3, 0.2 )
		const material = new MeshBasicMaterial({ wireframe: true })
		
		this.instanceEmpty = new Mesh( geometry, material )
		this.instanceEmpty.rotation.reorder('YXZ')
		this.instanceEmpty.position.copy( this.parameters.position )

		// this.scene.add(this.instanceEmpty)
	}
	cameraPosition() {
		const vector = this.parameters.cameraPosition.clone()
		vector.applyQuaternion( this.instanceEmpty.quaternion )
		vector.add( this.instanceEmpty.position )

		return vector
	}
	cameraLookAt() {
		const vector = this.parameters.lookAt.clone()
		vector.applyQuaternion( this.instanceEmpty.quaternion )
		vector.add( this.instanceEmpty.position )

		return vector
	}
    setInstance() {
        this.instanceGroup = new Group()
        const aspect = this.sizes.width / this.sizes.height
		
        // Base camera
        this.instance = new PerspectiveCamera(47, aspect, 0.8, 30)
        this.instance1 = new PerspectiveCamera(45, aspect, 0.8, 30)
        this.scene.add(this.instance)
        this.scene1.add( this.instance )

		this.parameters.lookAt.z -= this.parameters.radius

		// Calculate camera
        this.instance.position.copy( this.cameraPosition() )
		this.instance.lookAt( this.cameraLookAt() )
		
		this.instance1.position.set( 0, 0, 4 )
    }
    resize() {
        const aspect = this.sizes.width / this.sizes.height
        this.instance.aspect = aspect
        this.instance1.aspect = aspect

        // const radius = 4 / aspect        
        // this.parameters.radius = gsap.utils.clamp( 5, 6.5, radius )

        // this.instance.position.y = this.calculateY( aspect )
        // this.instance.position.z = this.parameters.radius

        this.instance.updateProjectionMatrix()
        this.instance1.updateProjectionMatrix()
    }
    
    update() {
		// if (this.instanceEmpty) {
		// 	this.cameraLookAt()
		// } 
		// this.instance.lookAt( this.parameters.lookAt )
    }
}
