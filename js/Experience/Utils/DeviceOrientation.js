import EventEmitter from './EventEmitter'

export default class DeviceOrientationEvent extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.deviceOrientationTarget = null

        // Resize
        this.deviceOrientation()
    }
    deviceOrientation() {
        if (window.DeviceOrientationEvent) {  
            window.addEventListener('deviceorientation', (event) => {
                // Set click tagret
                this.deviceOrientationTarget = event

                // Add mouse event
                this.trigger('deviceOrientation')
            })
        }
    }
}