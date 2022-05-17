import * as THREE from 'three'
import gsap from 'gsap'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import Experience from '../Experience'

export default class pointsOfInterest {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.points = this.experience.points.list
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.raycaster = new THREE.Raycaster()
        
        // Add parameters
        this.pointsGroup = new THREE.Group()
        this.pointsGroup.name = 'pointsGroup'
        this.worldGroup = this.scene.children.find( child => child.name === 'worldGroup' )
        this.towerGroup = this.worldGroup.children.find(group => group.name === 'towerGroup')
        
        // Methods
        this.createPoints()

        // Events
        this.sizes.on('resize', () => { this.resize() })
    }

    createPoints() {
        // Default points geometry and material
        const geometry = new THREE.BoxBufferGeometry(0, 0, 0)
        const material = new THREE.MeshBasicMaterial()
        
        // Create points
        this.points.forEach( point => {
            const mesh = new THREE.Mesh(
                geometry.clone(),
                material.clone()
            )
            mesh.position.copy( point.position )
            mesh.geometry.computeBoundingBox()
            this.pointsGroup.add(mesh)

            const pointLabel = new CSS2DObject( point.element )
            pointLabel.position.set(0, 0, 0 )
            mesh.add( pointLabel )
            
        })
        this.worldGroup.add( this.pointsGroup )

        // CSS 2D renderer
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height )
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style.pointerEvents = 'none'
        this.labelRenderer.domElement.style.overflow = ''
        document.body.appendChild( this.labelRenderer.domElement )
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
                    point.element.classList.add('visible')
                }
            } else {
                // Compare distanse part
                const intersectionDistance = intersects[0].distance                
                const pointDistance = pointPosition.distanceTo(this.camera.position)

                if ( intersectionDistance < pointDistance ) {
                    if (isPointVisible) {
                        point.element.classList.remove('visible')
                    }
                } else {
                    if (!isPointVisible) {
                        point.element.classList.add('visible') 
                    }
                }
            }
        })
    }
    resize() {
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height );
    }
    update() {
        // CSS renderer and raycaster animation
        this.labelRenderer.render( this.scene, this.camera );
        this.raycasterAnimation()
    }
}