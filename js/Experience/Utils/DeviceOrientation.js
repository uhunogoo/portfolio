import EventEmitter from './EventEmitter'
import { throttle } from 'lodash-es'

export default class DeviceOrientationEvent extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.deviceOrientationTarget = null

        // Resize
        this.deviceOrientation()
    }
    deviceOrientation() {       
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // Handle iOS 13+ devices.
            DeviceMotionEvent.requestPermission()
                .then((state) => {
                    if (state === 'granted') {
                        this.orientationEvent()
                    } else {
                        console.error('Request to access the orientation was rejected')
                    }
                })
                .catch(console.error)
          } else {
            // Handle regular non iOS 13+ devices.
            this.orientationEvent()
          }
    }
    orientationEvent() {
        const throttleFunction = throttle((event) => {           
            // Set click tagret
            this.deviceOrientationTarget = event
    
            // Add mouse event
            this.trigger('deviceOrientation')
        }, 80)

        window.addEventListener('deviceorientation', throttleFunction)
    }
}