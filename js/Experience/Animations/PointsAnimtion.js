
import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience'

export default class PointsAnimation {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.raycaster = new THREE.Raycaster()
        
        // Defaults
        this.firstDraw = false
        this.worldGroup = this.scene.children.find( child => child.name === 'worldGroup' )
        this.towerGroup = this.worldGroup.children.find(group => group.name === 'towerGroup')
        this.pointsGroup = this.worldGroup.children.find(group => group.name === 'pointsGroup')

        // Animation
        this.tl = gsap.timeline()
        gsap.registerEffect({
            name: "pointsShow",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                        duration: 0.3,
                        ease: 'power2.inOut'
                    },
                })
                tl.to(target, {
                    scale: parameters.scale,
                })

                return tl
            }
        })
        
    }
    raycasterAnimation() {
        this.points.forEach((point, i) => {
            const isPointVisible = point.element.classList.contains('visible')

            // Transform point coordinate to worldPosition
            const pointPosition = new THREE.Vector3()
            this.pointsGroup.children[i].getWorldPosition(pointPosition)
            
            // Transform worldposition to camera coordinate system
            const coords = pointPosition.clone()
            coords.project( this.camera )

            // Setup raycaster
            this.raycaster.setFromCamera( coords, this.camera )
            const intersects = this.raycaster.intersectObject(this.towerGroup, true )

            // Point visible by default
            if (intersects.length === 0) {
                if (!isPointVisible) {
                    point.element.classList.remove('unvisible')
                    point.element.classList.add('visible')
                    
                    // Play animation
                    this.tl.pointsShow( point.element.querySelector('.lable'), {scale: 1})
                }
            } else {
                // Compare distanse part
                const intersectionDistance = intersects[0].distance                
                const pointDistance = pointPosition.distanceTo(this.camera.position)
                
                if ( intersectionDistance < pointDistance ) {
                    if (isPointVisible) {
                        point.element.classList.remove('visible')
                        point.element.classList.add('unvisible')

                        // Play animation
                        this.tl.pointsShow( point.element.querySelector('.lable'), {scale: 0})
                    }
                } else {
                    if (!isPointVisible) {
                        point.element.classList.remove('unvisible')
                        point.element.classList.add('visible')
                        
                        // Play animation
                        this.tl.pointsShow( point.element.querySelector('.lable'), {scale: 1})
                    }
                }
            }
        })
    }
    update() {
        this.raycasterAnimation()
    }
}