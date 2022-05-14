import CameraMove from './CameraMove'

export default class Animation {
    constructor (target) {
        // Animations
        this.cameraMove = new CameraMove( target )
        
        // State
        this.cameraAnimationCoplete = false
        this.cameraMove.on('animationComplete', () => {
            this.cameraAnimationCoplete = true
        })
    }
    update() {
        if(this.cameraAnimationCoplete) {
            this.cameraMove.update()
        }
    }
}