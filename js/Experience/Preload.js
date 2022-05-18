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
        this.resources.on('loadingProgress', () => {
            this.loading()
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
                gsap.set(rect, { attr:{width: 49, height: 49, x: c*50, y: r*50 }})
                svg.appendChild(rect)
            }
        }
    }
    loading() {
        const that = this
        const colors = ['#d4a268', '#533f28']


        function weightedRandom(collection, ease) {
            return gsap.utils.pipe(
                Math.random,            //random number between 0 and 1
                gsap.parseEase(ease),   //apply the ease
                gsap.utils.mapRange(0, 1, -0.5, collection.length-0.5), //map to the index range of the array, stretched by 0.5 each direction because we'll round and want to keep distribution (otherwise linear distribution would be center-weighted slightly)
                gsap.utils.snap(1),     //snap to the closest integer
                i => collection[i]      //return that element from the array
            );
        }
        let randomColor = weightedRandom(colors, "circ.inOut")
        gsap.set('.preload svg rect', { fill: '#ffffff', scale: 0, transformOrigin: 'center', autoAlpha: 0})

        
        const preload = gsap.timeline()
        preload.to('.preload svg rect', {
            autoAlpha: 1,
        })
        preload.to('.preload svg rect', {
            scale: 1,
            ease: 'circ',
            duration: 1,
            stagger: {
                each: 0.015,
                from: 'random'
            }
        })
        preload.to('.preload svg rect', {
            fill: randomColor,
            duration: 1.5,
        }, '<')
        preload.to('.preload', {
            autoAlpha: 0
        })
    }
}