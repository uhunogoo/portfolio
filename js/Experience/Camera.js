import gsap from 'gsap'
import { Group, Vector3, PerspectiveCamera } from 'three'

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
        this.parameters.cameraPosition = new Vector3(2, 2, 2)
        this.parameters.lookAt = new Vector3(0, 2.5, 0)

        // call method
        this.setInstance()
    }
    calculateY( aspect ) { 
        return Math.max(1.25, ( aspect < 1) ? 2 / aspect : 1.25) 
    }
    setInstance() {
        this.instanceGroup = new Group()
        this.scene.add(this.instanceGroup)
        const aspect = this.sizes.width / this.sizes.height

        // Base camera
        this.instance = new PerspectiveCamera(45, aspect, 0.1, 50)
        this.instance.position.copy( this.parameters.cameraPosition )
        this.instance.lookAt( this.parameters.lookAt )

        const radius = (aspect < 1) ? Math.max( 5, 4 / aspect ) : 5 
        this.parameters.cameraY = this.calculateY( aspect )
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, radius )
        
        this.instanceGroup.add(this.instance)
    }
    resize() {
        const aspect = this.sizes.width / this.sizes.height
        this.instance.aspect = aspect

        const radius = (aspect < 1) ? Math.max( 5, 4 / aspect ) : 5 
        this.parameters.radius = gsap.utils.clamp( 5, 6.5, radius )

        this.instance.position.y = this.calculateY( aspect )
        this.instance.position.z = this.parameters.radius
        this.instance.position.x = this.parameters.radius

        this.instance.updateProjectionMatrix()
    }
    
    update() {
        this.instance.lookAt( this.parameters.lookAt )
    }
}