import CameraMove from './CameraMove'

export default class Animation {
    constructor (target) {
        // Animations
        this.cameraMove = new CameraMove( target )
    }
    update() {
        this.cameraMove.update()
    }
}