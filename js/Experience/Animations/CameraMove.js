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
        for ( const point of this.points  ) {
            console.log(
                point.animation
            )
            point.element.addEventListener('mousedown', (e) => {
                const currentPointPosition = point.position.clone()
                const { step, radius } = point.animationParameters
    
                const timeline = gsap.timeline({
                    defaults: {
                        duration: 1,
                        ease: 'power4.inOut'
                    },
                })
                timeline.to(this.camera.position, {
                    x: '+=' + (this.camera.position.x - Math.cos( Math.PI * step ) * radius) * -1,
                    y: currentPointPosition.y + 0.75,
                    z: '+=' + (this.camera.position.z - Math.sin( Math.PI * step ) * radius) * -1
                }, '<+=10%')
                timeline.to(this.cameraParameters.lookAt, {
                    y: currentPointPosition.y
                }, '<')
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
            radius: '+=3',
        }, '<')
    }
}