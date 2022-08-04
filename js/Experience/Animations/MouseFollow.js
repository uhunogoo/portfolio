import gsap from 'gsap'
import Experience from '../Experience'

export default class followingCursor {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.size = this.experience.sizes
        
        // Defaults
        this.body = document.body
        this.targteBlock = document.querySelector('.following')
        this.targetBlockSizes = this.targteBlock.getBoundingClientRect()
        
    }
    mouseMove() {
        if ( this.body.clientWidth < 767.5 ) return 
        const { x, y } = this.mouse

        gsap.to('.following', {
            x: ( (x + 1) / 2 ) * this.size.width - this.targetBlockSizes.width * 0.5,
            y: ( (- y + 1.0) / 2 ) * this.size.height - this.targetBlockSizes.height * 0.5,
            ease: 'power4'
        })
        
    }

}