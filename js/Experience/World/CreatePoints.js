import * as THREE from 'three'
import gsap from 'gsap'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import Experience from '../Experience'

export default class Createpoints {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.points = this.experience.points.list
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        
        // Add parameters
        this.pointsGroup = new THREE.Group()
        this.pointsGroup.name = 'pointsGroup'
        this.worldGroup = this.scene.children.find( child => child.name === 'worldGroup' )
        
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

        // CSS 2D renderer
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height )
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style.pointerEvents = 'none'
        this.labelRenderer.domElement.style.overflow = ''
        document.body.appendChild( this.labelRenderer.domElement )
    }
    resize() {
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height );
    }
    update() {
        // CSS renderer
        this.labelRenderer.render( this.scene, this.camera )
    }
}