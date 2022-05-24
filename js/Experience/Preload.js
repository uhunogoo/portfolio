import gsap from 'gsap'
import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'

export default class Preload extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.experience = new Experience()
        this.resources = this.experience.resources
        
        // Defaults
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
        this.preloadHovered = false
        
        // actions
        this.createSVG()
        this.animationControll()  
    }
    animationControll() {
        // Create animations
        this.playOutAnimation = gsap.timeline({ 
            paused: true, 
            onComplete: () => this.trigger('preloadComplete') 
        })
        this.playInAnimation = gsap.timeline({ 
            paused: true,
            onComplete: () => {
                document.querySelector('.preload').addEventListener('click', () => {
                    this.trigger( 'preloadWasClicked' )
                    this.playOutAnimation.play()
                })
            }
        })
        this.preload = gsap.timeline({
            paused: true,
            onComplete: () => this.playInAnimation.play()
        })


        // Call base animations
        this.loading()
        this.inAnimation()
        this.outAnimation()

        // Start animation
        this.resources.on('loadingProgress', () => {
            gsap.fromTo(this.progress, { value: this.progress.value }, {
                value: this.resources.loaded / this.resources.toLoad,
                duration: 1,
                onUpdate: () => {
                    this.preload.play(this.progress.value)
                }
            })
        })
    }
    //chuck a bunch of square <rects> in the svg
    createSVG() {
        // Setup <rect> grid
        let svgNS = "http://www.w3.org/2000/svg"
        let svg = document.getElementById("grid")
        let rows = 10
        let cols = 10
        for(let r = 0; r < rows; r++){
            for(let c = 0; c < cols; c++){
                let rect = document.createElementNS(svgNS, "rect")
                gsap.set(rect, { attr:{width: 51, height: 51, x: c*50, y: r*50 }})
                svg.appendChild(rect)
            }
        }


        // Base parameters
        gsap.to('.preload', {
            autoAlpha: 1,
        })
        gsap.set('.preload svg rect', { fill: '#ffeeee' })
    }
    loading() {  
        this.preload.from('.preload__progress', {
            duration: 2,
            scaleX: 0,
            transformOrigin: 'left center'
        })  
    }
    inAnimation() {
        this.playInAnimation.to('.preload__progress', {
            duration: 0.5,
            scaleX: 0,
            ease: 'none',
            transformOrigin: 'right center'
        })
        this.playInAnimation.to('.code div', {
            scaleY: '1.5',
            transformOrigin: 'left top',
            ease: 'power4',
            stagger: {
                amount: 0.2
            }
        })
        this.playInAnimation.to('.code div', {
            y: '100%',
            transformOrigin: 'left top',
            ease: 'power4',
            stagger: {
                amount: 0.2,
            }
        })
        this.playInAnimation.from( '.title div', {
            y: '-100%',
            scaleX: 0.7,
            ease: 'power4',
            stagger: {
                amount: 0.2,
            }
        }, '<+=10%')
        this.playInAnimation.from('svg', {
            y: '-100%',
            opacity: 0,
            ease: 'power3.out',
            duration: 0.4,
            transformOrigin: 'center'
        }, '<+=5%')
    }
    outAnimation() {
        this.playOutAnimation.to( '.title div', {
            y: '-100%',
            ease: 'power4',
            stagger: {
                amount: 0.2,
                from: 'end'
            }
        })
        this.playOutAnimation.to('svg', {
            y: '-100%',
            opacity: 0,
            ease: 'power4.out',
            duration: 0.6,
            transformOrigin: 'center'
        }, '>-=80%')

        this.playOutAnimation.to('.preload__bg ', {
            y: '-110%',
            skewY: '2.5deg',
            ease: 'power3.inOut',
            duration: 1.5,
        }, '<+=20%')
        this.playOutAnimation.to('.preload__bg div', {
            y: '-80%',
            skewY: '2.5deg',
            ease: 'power2.inOut',
            duration: 1.5,
        }, '<+=10%')

        this.playOutAnimation.to('.preload', {
            autoAlpha: 0,
        }, '>-=20%')
    }
}