import * as THREE from 'three'
import Experience from '../Experience'

export default class Createpoints {
    constructor (parentGroup) {
        // Setup
        this.experience = new Experience()
        this.points = this.experience.points.list
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Add parameters
        this.parentGroup = parentGroup
        
        // Methods
        this.createPoints()
    }

    createPoints() {
        // Default points geometry and material
        const points = new THREE.Group()
        const material = new THREE.SpriteMaterial( { map: this.resources.items.pointTexture } )
        
        // Create points
        this.points.forEach( point => {
            const sprite = new THREE.Sprite( material.clone() )
            
            sprite.position.copy( point.position )
            sprite.scale.setScalar(0.1)
            sprite.geometry.computeBoundingBox()
            points.add(sprite)
        })
        points.scale.divideScalar( this.parentGroup.scale.x )
        this.parentGroup.add(points)
    }
    update() {
    }
}