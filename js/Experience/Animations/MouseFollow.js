import * as _ from 'lodash-es'
import gsap from 'gsap'
import Experience from '../Experience'

export default class followingCursor {
    constructor (target) {
        // Setup
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.size = this.experience.sizes
        
        // Defaults
        this.targteBlock = document.querySelector('.following')
        this.targetBlockSizes = this.targteBlock.getBoundingClientRect()
        const following = document.querySelector('.following')
        const followingLook = following.querySelector('.following__look')
        const followingPlay = following.querySelector('.following__play')

        // Events
        const throttleFunction = _.throttle(() => {           
            this.mouseMove() 
        }, 40)
        this.mouse.on('mouseMove', () => {
            throttleFunction()
        })
        
        
        // Show play text
        this.showPlay = gsap.timeline({ paused: true, defaults: { duration: 0.25 } })
        this.showPlay.fromTo(followingPlay, { autoAlpha: 0, scale: 1.2, filter: 'blur(0.1em)' },{
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0)'
        })
        this.showPlay.to(followingLook, { 
            autoAlpha: 0, 
            scale: 1.2, 
            filter: 'blur(0.1em)'
        }, 0)
        
        // Show look text
        this.showLook = gsap.timeline({ paused: true, defaults: { duration: 0.25 } })
        this.showLook.fromTo(followingLook, { autoAlpha: 0, scale: 1.2, filter: 'blur(0.1em)' },{
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0)'
        })
        this.showLook.to(followingPlay, { 
            autoAlpha: 0, 
            scale: 1.2, 
            filter: 'blur(0.1em)'
        }, 0)
        
    }
    mouseMove() {
        const { x, y } = this.mouse

        gsap.to('.following', {
            x: ( (x + 1) / 2 ) * this.size.width - this.targetBlockSizes.width * 0.5,
            y: ( (- y + 1.0) / 2 ) * this.size.height - this.targetBlockSizes.height * 0.5,
            ease: 'power4'
        })
        
    }

}