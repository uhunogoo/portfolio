import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Animation {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.cameraParameters = this.experience.camera.parameters
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.animation()

    }
    animation() {
        this.cameraParameters.step = 0
        this.cameraParameters.radius = 4

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
            }
        })
        // // step 1
        this.tl.to(this.cameraParameters.lookAt, {
            y: 1,
        })
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
            radius: '+=2',
        }, '<')
    }
}