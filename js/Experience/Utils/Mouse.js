import EventEmitter from './EventEmitter'
import Sizes from './Sizes'
export default class Mouse extends EventEmitter {
    constructor() {
        super()
        this.sizes = new Sizes()

        // Setup
        this.x = 0
        this.y = 0
        this.clickTarget = null
        this.moveTarget = null

        // Resize
        this.mouseMove()
        this.mouseClick()
    }
    mouseClick() {
        document.addEventListener('click', (e) => {
            // Set click tagret
            this.clickTarget = e.target

            // Add mouse event
            this.trigger('mouseClick')
        })
    }
    mouseMove() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            // Set click tagret
            this.moveTarget = e.target

            // Set coordinates
            this.x = ( e.clientX / this.sizes.width ) * 2 - 1
            this.y = - ( e.clientY / this.sizes.height ) * 2 + 1

            // Add mouse event
            this.trigger('mouseMove')
        })
    }
}