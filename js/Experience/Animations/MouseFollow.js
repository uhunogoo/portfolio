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

        // Events
        this.mouse.on('mouseMove', () => {
            this.mouseMove()
        })
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