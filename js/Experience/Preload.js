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
        this.createSVG()
        this.loading()
        
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
    }
    loading() {
        const colors = ['#d4a268', '#533f28']
        const text = document.querySelector('h1').childNodes

        function weightedRandom(collection, ease) {
            return gsap.utils.pipe(
                Math.random,
                gsap.parseEase(ease),
                gsap.utils.mapRange(0, 1, -0.5, collection.length-0.5),
                gsap.utils.snap(1),
                i => collection[i]
            );
        }
        let randomColor = weightedRandom(colors, "circ.inOut")
        gsap.set('.preload svg rect', { fill: randomColor }) 

        const showText = gsap.timeline({ 
            paused: true,
            onComplete: () => {
                window.addEventListener('click', () => this.finis.play())
            }
        })
        this.preload = gsap.timeline({
            paused: true,
            onComplete: () => showText.play()
        })
        this.preload.to('.preload', {
            autoAlpha: 1,
        })

        this.preload.from('.preload svg rect', {
            scale: 0,
            ease: 'power2',
            transformOrigin: '50% 50%',
            stagger: {
                amount: 1,
                each: 0.01,
                from: 'random'
            }
        })
        this.preload.from('.preload__progress', {
            duration: 2,
            scaleX: 0,
            transformOrigin: 'left center'
        }, 0)

        
        showText.to('.preload__progress', {
            scaleX: 0,
            duration: 0.9,
            ease: 'power4',
            transformOrigin: 'right center'
        })
        showText.from( '.title div', {
            filter: 'blur(0.1em)',
            x: '100%',
            opacity: 0,
            ease: 'power4',
            stagger: {
                amount: 1,
                // each: 0.04,
            }
        }, '<')
        showText.to('.code div', {
            scaleY: '1.4',
            transformOrigin: 'left top',
            ease: 'power3',
            stagger: {
                amount: 1,
                // each: 0.04,
            }
        }, '<+=24%')

        this.finis = gsap.timeline({ paused: true })
        this.finis.to('.preload svg rect', {
            y: 801,
            duration: 4,
            ease: 'power4',
        })
        this.finis.to( '.title div', {
            y: '90%',
            ease: 'power4.inOut',
            duration: (1 / text.length) * 10.0,
            stagger: 0.04,
        }, '<')
        this.finis.to('.code div', {
            y: '110%',
            duration: 0.6,
            transformOrigin: 'left top',
            ease: 'power3',
            stagger: {
                each: 0.04
            }
        }, '<')

        this.finis.to('.preloader__left', {
            x: '-100%',
            ease: 'power3',
            duration: 1.5,
        }, '<+=80%')
        this.finis.to('.preloader__right', {
            x: '100%',
            ease: 'power3',
            duration: 1.5,
        }, '<')
        this.finis.to('.preloader__left div', {
            x: '-20%',
            duration: 1.5,
        }, '<+=10%')
        this.finis.to('.preloader__right div', {
            x: '20%',
            duration: 1.5,
        }, '<')
        

        // preload.to('.preload', {
        //     autoAlpha: 0
        // })
    }
}