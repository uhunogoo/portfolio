import gsap from 'gsap'
import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'

export default class Preload extends EventEmitter {
    constructor() {
        super()

        // Options
        this.experience = new Experience()
        this.resources = this.experience.resources

        // Setup
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
        
        // action
        this.resources.on('loadingProgress', () => {
            this.loading()
        })
    }
    loading() {
        const that = this
        // Set default styles
        gsap.set('.loader', {
            clipPath: 'circle(150% at 50% 50%)'
        })

        // experience
        gsap.fromTo( this.progress, {value: this.progress.value}, {
            value: (this.resources.loaded / this.resources.toLoad),
            duration: 2,
        })
        // Animate percent value
        // function animationUpdate() {
        //     const v = 100 * this.progress().toFixed(2)
        //     that.progressBlock.innerHTML = v.toFixed(0)
        // }
        // // Animation onComplete
        // function animationComplete() {
        //     const outTL = gsap.timeline({
        //         onComplete: () => {
        //             that.trigger('ready')
        //         },
        //         defaults: {
        //             duration: 0.8,
        //             ease: 'sine'
        //         }
        //     })
        //     outTL.to( '.loader', {
        //         delay: 0.5,
        //         clipPath: 'circle(0% at 50% 50%)',
        //     })
        //     outTL.to('.loader span', {
        //         filter: 'blur(1em)',
        //         scale: 2
        //     }, '<+=40%')
        //     outTL.to('.loader', {
        //         autoAlpha: true
        //     })
        // }
    }
}