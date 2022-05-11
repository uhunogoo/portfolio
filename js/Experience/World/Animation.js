import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Animation {
    constructor () {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.cameraParameters = this.experience.camera.parameters

        // Add parameters
        this.cameraParameters.step = 0
        this.cameraParameters.radius = 4
        this.animationComplete = false
        this.raycaster = new THREE.Raycaster()

        this.animation()
        this.lablesAnimation()

    }
    animation() {

        this.tl = gsap.timeline({
            delay: 3,
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            },
            onUpdate: () => {
                const { step, radius } = this.cameraParameters
                this.camera.position.x = Math.cos( Math.PI * step ) * radius
                this.camera.position.z = Math.sin( Math.PI * step ) * radius

                this.cameraParameters.lookAt.y = this.camera.position.y
                this.camera.lookAt( this.cameraParameters.lookAt )
            },
            onComplete: () => this.animationComplete = true
        })
        // // step 1
        this.tl.to(this.camera.position, {
            y: 1.2,
        }, 0)
        this.tl.to(this.cameraParameters, {
            step: 1.75
        }, '<')
        this.tl.to(this.cameraParameters, {
            step: 2.25,
            ease: 'circ'
        }, '<+=60%')
        this.tl.to(this.cameraParameters, {
            radius: '+=2.5',
        }, '<')
    }
    lablesAnimation() {
        this.points = [
            {
                element: document.querySelector('.point-0'),
                position: new THREE.Vector3( 0, 1, 0 )
            }
        ]
    }
    update() {
        if(this.animationComplete) {
            for (const point of this.points ) {
                const screenPosition = point.position.clone()
                screenPosition.project(this.camera)
    
                this.raycaster.setFromCamera( screenPosition, this.camera )
                const intersects = this.raycaster.intersectObjects(this.scene.children, true)
                if (intersects.length === 0) {
                    point.element.classList.add('visible')
                } else {
                    const intersectionDistance = intersects[0].distance
                    const pointDistance = point.position.distanceTo(this.camera.position)
                    if ( intersectionDistance < pointDistance ) {
                        point.element.classList.remove('visible')
                    } else {
                        point.element.classList.add('visible') 
                    }
                }
    
                const translateX = screenPosition.x * this.sizes.width * 0.5
                const translateY = -screenPosition.y * this.sizes.height * 0.5
                point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    
            }
        }
    }
}