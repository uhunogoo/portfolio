import EventEmitter from './EventEmitter'
import Sizes from './Sizes'
export default class Mouse extends EventEmitter {
    constructor() {
        super()
        this.sizes = new Sizes()

        // Setup
        this.x = document.documentElement.clientWidth
        this.y = window.innerHeight

        // Resize
        this.mouseMove()
    }
    mouseMove() {
        // Mouse move
        window.addEventListener('mousemove', (event) => {
            this.x = event.clientX / this.sizes.width - 0.5
            this.y = event.clientY / this.sizes.height - 0.5
        })
    }
}