import gsap from 'gsap'
import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'

export default class CameraMove extends EventEmitter {
    constructor () {
        super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug
        this.cameraParameters = this.experience.camera.parameters

        // Add parameters
        this.cameraParameters.step = 0
        this.cameraParameters.radius = 4
        this.animationComplete = false

        this.animation()
        this.pointsClick()

    }
    pointsClick() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const targetParent = target.offsetParent

            const currentPoint = this.points.find( child => child.element === targetParent)
            if (!currentPoint) return

            const currentPointPosition = currentPoint.position

            const timeline = gsap.timeline({
                defaults: {
                    duration: 1,
                    ease: 'power2.inOut'
                },
                onUpdate: () => {
                    // const { step, radius } = this.cameraParameters
                    // this.camera.position.x = Math.cos( Math.PI * currentPointPosition.y ) * (currentPointPosition.x + 1)
                    // this.camera.position.z = Math.sin( Math.PI * currentPointPosition.y ) * (currentPointPosition.x + 1)

                    this.cameraParameters.lookAt.y = this.camera.position.y
                },
            })
            timeline.to(this.camera.position, {
                x: currentPointPosition.x,
                y: currentPointPosition.y,
                z: currentPointPosition.z
            })
            // timeline.to()
        })
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
            },
            onComplete: () => this.trigger('animationComplete')
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
}