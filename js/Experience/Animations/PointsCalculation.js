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

        // every time the camera or objects change position (or every frame)
        this.camera.updateMatrix()
        this.camera.updateMatrixWorld()
        // // this.camera.matrixWorldInverse.invert( this.camera.matrixWorld )

        this.frustum = new THREE.Frustum()
        this.matrix = new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
        this.frustum.setFromProjectionMatrix(this.matrix)

        // Add parameters
        this.animationComplete = false
        this.raycaster = new THREE.Raycaster()

        this.createPoints()
    }

    createPoints() {
        const geometry = new THREE.BoxBufferGeometry(0, 0, 0)
        const material = new THREE.MeshBasicMaterial()
        this.points.forEach( point => {
            const mesh = new THREE.Mesh(
                geometry.clone(),
                material.clone()
            )
            mesh.position.copy( point.position )
            this.scene.add(mesh)

            const pointLabel = new CSS2DObject( point.element )
            pointLabel.position.set(0, 0, 0 )
            mesh.add( pointLabel )


            this.labelRenderer = new CSS2DRenderer()
            this.labelRenderer.setSize( window.innerWidth, window.innerHeight )
            this.labelRenderer.domElement.style.position = 'absolute'
            this.labelRenderer.domElement.style.top = '0px'
            document.body.appendChild( this.labelRenderer.domElement )

            this.controls = new OrbitControls( this.camera, this.labelRenderer.domElement )
            this.controls.enableDamping = true
            this.controls.maxPolarAngle = Math.PI * 0.53
        })
    }

    update() {
        this.controls.update()
        this.labelRenderer.render( this.scene, this.camera );
        // for (const point of this.points ) {
        //     const screenPosition = point.position.clone()
        //     screenPosition.project(this.camera)

        //     // console.log( this.camera.position.angleTo( point.position ) > ( Math.PI / 2 ) )
            
        //     const pointInView = (Math.abs(screenPosition.x) >= 1 || Math.abs(screenPosition.y) >= 1) ? false : true

        //     this.raycaster.setFromCamera( screenPosition, this.camera )
        //     const intersects = this.raycaster.intersectObjects(this.scene.children, true)
        //     if (intersects.length === 0) {
        //         point.element.classList.add('visible')
        //     } else {
        //         const intersectionDistance = intersects[0].distance
        //         const pointDistance = point.position.distanceTo(this.camera.position)
        //         if ( intersectionDistance < pointDistance || !pointInView ) {
        //             point.element.classList.remove('visible')
        //         } else {
        //             point.element.classList.add('visible') 
        //         }
        //     }

        //     // const translateX = screenPosition.x * this.sizes.width * 0.5
        //     // const translateY = -screenPosition.y * this.sizes.height * 0.5
        //     // point.element.style.transform = `translate(${Math.trunc(translateX)}px, ${Math.trunc(translateY)}px)`

        // }
    }
}