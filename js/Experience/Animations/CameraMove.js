import gsap from 'gsap'
import * as THREE from 'three'

import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'

export default class CameraMove extends EventEmitter {
    constructor ( target ) {
        super()

        this.target = target        
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.cameraGroup = this.experience.camera.instanceGroup
        this.mouse = this.experience.mouse

        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75
        this.parameters.radius = 4.5
        this.parameters.cameraY = 0.75

        // Add parameters
        this.animationComplete = false
        this.previousTime = 0
        this.clock = new THREE.Clock()


        gsap.registerEffect({
            name: "clickEffect",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                        duration: 2,
                        ease: 'power4.inOut'
                    },
                })
                tl.to(this.parameters.lookAt, {
                    y: parameters.y,
                })
                tl.to(this.target.rotation, {
                    y: Math.PI * parameters.angle
                }, '<')
                tl.to(this.camera.position, {
                    x: parameters.radius,
                    y: parameters.y + 0.75,
                    z: parameters.radius,
                    ease: 'power3.inOut'
                }, '<')

                return tl
            }
        })
        
        this.animation()
        this.on('animationComplete', () => {
            this.animationComplete = true
            this.pointsClick()
            this.closeBtn()
        })
    }
    closeBtn() {
        const closeBtn = [...document.querySelectorAll('.close_btn')]
        closeBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                const { angle, radius } = this.parameters

                const animation = gsap.timeline()
                animation.clickEffect( btn, { 
                    y: 0.75,
                    angle, 
                    radius 
                })
                animation.to('.point__content', {
                    autoAlpha: 0,
                }, 0)
            })
        })
    }
    pointsClick() {
        for ( const point of this.points  ) {
            point.element.addEventListener('mousedown', (e) => {
                
                const currentPointPosition = point.position.clone()
                const { angle, radius } = point.animationParameters

                const animation = gsap.timeline()
                animation.clickEffect( point, { 
                    y: currentPointPosition.y,
                    angle, 
                    radius 
                })
                animation.to('[data-trigger=' + point.element.id + ']', {
                    autoAlpha: 1,
                }, '<+=200%')
            })
        }
        
    }
    animation() {
        this.tl = gsap.timeline({
            delay: 3,
            defaults: {
                duration: 2,
                ease: 'power2.inOut'
            },
            onComplete: () => {
                this.trigger('animationComplete')
            }
        })
        this.tl.to(this.parameters.lookAt, {
            y: 1,
        }, '<')
        this.tl.to(this.target.rotation, {
            y: Math.PI * this.parameters.angle
        }, '<')
        this.tl.to(this.camera.position, {
            x: this.parameters.radius,
            y: 0.75,
            z: this.parameters.radius,
            ease: 'power3.inOut'
        }, '<')
        this.tl.to(this.target.rotation, {
            y: Math.PI * this.parameters.angle,
            ease: 'circ'
        }, '<+=60%')
    }
    update() {
        if (!this.animationComplete) return
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        const parallaxY = - this.mouse.y * 0.3
        const parallaxX = this.mouse.x * 0.5

        this.cameraGroup.rotation.x += (parallaxY - this.cameraGroup.rotation.x) * 5 * deltaTime
        this.cameraGroup.rotation.y += (parallaxX - this.cameraGroup.rotation.y) * 5 * deltaTime       
    }
}