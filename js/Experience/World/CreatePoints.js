import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience'

export default class Createpoints {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.points = this.experience.points.list
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Add parameters
        this.pointsGroup = new THREE.Group()
        this.pointsGroup.name = 'pointsGroup'
        
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
            sprite.scale.setScalar(0)
            sprite.geometry.computeBoundingBox()
            points.add(sprite)
        })
        points.scale.divideScalar( this.pointsGroup.scale.x )
        this.pointsGroup.add(points)
    }
    resize() {
        const windowWidth = document.documentElement.clientWidth
        const x = ( w ) => {
            if ( w > 767.5 ) {
                if ( w < 991.5 ) {
                    return '6.5vw'
                } else if (w < 1499.5){
                    return '10vw'
                } else {
                    return '450%'
                }
            } else return 0
        }
        const y = (windowWidth > 767.5) ? -50 : 0
        
        gsap.set( '.content__links', { x: x( windowWidth ), yPercent: y })
    }
    update() {
    }
}