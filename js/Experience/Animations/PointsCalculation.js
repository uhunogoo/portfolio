import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '../Experience'

export default class pointsOfInterest {
    constructor () {
        this.experience = new Experience()

        this.points = this.experience.points.list
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.cameraParameters = this.experience.camera.parameters
        this.raycasterObject = this.scene.children.find( child => child.type === 'Group' )
        this.dummyVector = new THREE.Vector3()
        // Add parameters
        this.animationComplete = false
        this.raycaster = new THREE.Raycaster()

        this.createPoints()

        // document.addEventListener('mousedown', () => {
        //     const that = this
        //     function onMouseMove () {
        //         that.raycasterAnimation()
        //     }
        //     document.addEventListener('mousemove', onMouseMove)
            
        //     document.addEventListener('mouseup', () => {
        //         document.removeEventListener('mousemove', onMouseMove)
        //     })
        // } )
    }

    createPoints() {
        const geometry = new THREE.BoxBufferGeometry(0, 0, 0)
        const material = new THREE.MeshBasicMaterial()
        this.pointsGroup = new THREE.Group()
        this.points.forEach( point => {
            const mesh = new THREE.Mesh(
                geometry.clone(),
                material.clone()
            )
            mesh.position.copy( point.position )
            this.pointsGroup.add(mesh)

            const pointLabel = new CSS2DObject( point.element )
            pointLabel.position.set(0, 0, 0 )
            mesh.add( pointLabel )

        })
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize( window.innerWidth, window.innerHeight )
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        document.body.appendChild( this.labelRenderer.domElement )

        this.controls = new OrbitControls( this.camera, this.labelRenderer.domElement )
        this.controls.enableDamping = true
        this.controls.target = this.cameraParameters.lookAt
        this.controls.maxPolarAngle = Math.PI * 0.53
        this.controls.update()

        this.scene.add(this.pointsGroup)
    }
    raycasterAnimation() {
        this.points.forEach(point => {
            const isPointVisible = point.element.classList.contains('visible')
            const coords = point.position.clone()
            coords.project(this.camera)
            coords.x.toFixed(2) 
            coords.y.toFixed(2) 
            coords.z.toFixed(2)
            
            
            this.raycaster.setFromCamera( coords, this.camera )
            const intersects = this.raycaster.intersectObjects(this.raycasterObject.children )

            if (intersects.length === 0) {
                if (!isPointVisible) {
                    point.element.classList.add('visible')
                }
            } else {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(this.camera.position)

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

    update() {
        // CSS2D renderer and OrbitControl
        this.controls.update()
        this.labelRenderer.render( this.scene, this.camera );


        this.raycasterAnimation()

    }
}