import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import Experience from '../Experience'

export default class pointsOfInterest {
    constructor () {
        this.experience = new Experience()

        this.points = this.experience.points.list
        this.pointsGroup = new THREE.Group()
        
        // Setup
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.cameraParameters = this.experience.camera.parameters
        this.dummyWorld = new THREE.Vector3()
        this.dummyDirection = new THREE.Vector3()
        
        // Add parameters
        this.animationComplete = false

        this.raycaster = new THREE.Raycaster()

        this.worldGroup = this.scene.children.find( child => child.name === 'worldGroup' )
        this.towerGroup = this.worldGroup.children.find(group => group.name === 'towerGroup')
        

        this.createPoints()
        this.raycasterAnimation()
        // Events
        this.sizes.on('resize', () => { this.resize() })
    }

    createPoints() {
        const geometry = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01)
        const material = new THREE.MeshBasicMaterial()
        
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

        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height )
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style.pointerEvents = 'none'
        document.body.appendChild( this.labelRenderer.domElement )
    }
    raycasterAnimation() {
        if(this.towerGroup) {
            this.pointsGroup.children.forEach((point, i) => {
                const isPointVisible = this.points[i].element.classList.contains( 'visible' )

                this.camera.getWorldDirection(this.dummyDirection)
                point.getWorldPosition(this.dummyWorld)

                this.raycaster.set( this.dummyWorld, this.dummyDirection.multiply( new THREE.Vector3(-1, 1, -1) ) )
                const intersects = this.raycaster.intersectObject( this.towerGroup )
                
                if (intersects.length === 0) {
                    if (!isPointVisible) {
                        this.points[i].element.classList.add('visible')
                    }
                } else {
                    if (isPointVisible) {
                        this.points[i].element.classList.remove('visible')
                    }
                }
            })
        }        
    }
    resize() {
        this.labelRenderer.setSize( this.sizes.width, this.sizes.height );
    }
    update() {
        this.labelRenderer.render( this.scene, this.camera );
        this.raycasterAnimation()
    }
}