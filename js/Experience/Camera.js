import gsap from 'gsap'
import { Group, Vector3, PerspectiveCamera, BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'three'

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
        this.parameters.radius = 0
        this.parameters.cameraY = 0
        this.parameters.position = new Vector3(0, 2, 2)
		this.parameters.cameraPosition = new Vector3(0, 0.5, 1)
        this.parameters.lookAt = new Vector3(0, 0, 0)

        // call method
		this.setCamenraEmpty()
        this.setInstance()
    }
    calculateY( aspect ) { 
        return Math.max(1.25, ( aspect < 1) ? 2 / aspect : 1.25) 
    }
	setCamenraEmpty() {
		const geometry = new BoxBufferGeometry(0.2, 0.3, 0.2 )
		const material = new MeshBasicMaterial()
		
		this.instanceEmpty = new Mesh( geometry, material )
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
        this.instance = new PerspectiveCamera(45, aspect, 0.1, 50)
        this.scene.add(this.instance)

        const radius = 4 / aspect
        this.parameters.cameraY = this.calculateY( aspect )
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, radius )
		this.parameters.lookAt.z -= this.parameters.radius

		// Calculate camera
        this.instance.position.copy( this.cameraPosition() )
		this.instance.lookAt( this.cameraLookAt() )
    }
    resize() {
        const aspect = this.sizes.width / this.sizes.height
        this.instance.aspect = aspect

        const radius = 4 / aspect        
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, radius )

        this.instance.position.y = this.calculateY( aspect )
        this.instance.position.z = this.parameters.radius
        this.instance.position.x = this.parameters.radius

        this.instance.updateProjectionMatrix()
    }
    
    update() {
		// if (this.instanceEmpty) {
		// 	this.cameraLookAt()
		// } 
		// this.instance.lookAt( this.parameters.lookAt )
    }
}
