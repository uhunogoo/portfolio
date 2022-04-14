import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.width = document.documentElement.clientWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min( window.devicePixelRatio, 2 )

        // Resize
        this.resizeEvent()
    }
    resizeEvent() {
        window.addEventListener('resize', () =>
        {
            // Update sizes
            this.width = document.documentElement.clientWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}