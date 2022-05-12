import * as THREE from 'three'

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


        // var targetPosition = new THREE.Vector3();
        // targetPosition = targetPosition.setFromMatrixPosition( cube.matrixWorld );

        // var lookAt = testCamera.getWorldDirection();
        // var cameraPos = new THREE.Vector3().setFromMatrixPosition( testCamera.matrixWorld );
        // var pos = targetPosition.sub( cameraPos );

        // behind = ( pos.angleTo( lookAt ) ) > ( Math.PI / 2 );


        console.log(this.points[0].position)
    }
    update() {
        for (const point of this.points ) {
            const screenPosition = point.position.clone()
            screenPosition.project(this.camera)

            // console.log( this.camera.position.angleTo( point.position ) > ( Math.PI / 2 ) )
            
            const pointInView = (Math.abs(screenPosition.x) >= 1 || Math.abs(screenPosition.y) >= 1) ? false : true

            this.raycaster.setFromCamera( screenPosition, this.camera )
            const intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (intersects.length === 0) {
                point.element.classList.add('visible')
            } else {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(this.camera.position)
                if ( intersectionDistance < pointDistance || !pointInView ) {
                    point.element.classList.remove('visible')
                } else {
                    point.element.classList.add('visible') 
                }
            }

            const translateX = screenPosition.x * this.sizes.width * 0.5
            const translateY = -screenPosition.y * this.sizes.height * 0.5
            point.element.style.transform = `translate(${Math.trunc(translateX)}px, ${Math.trunc(translateY)}px)`

        }
    }
}