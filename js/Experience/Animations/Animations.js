import pointsOfInterest from './PointsCalculation'
import CameraMove from './CameraMove'

export default class Animation {
    constructor () {
        // Animations
        this.points = new pointsOfInterest()
        this.cameraMove = new CameraMove()

        // State
        this.cameraAnimationCoplete = false
        this.cameraMove.on('animationComplete', () => {
            this.cameraAnimationCoplete = true
        })
    }
    update() {
        if(this.cameraAnimationCoplete) {
            this.points.update()
        }
    }
}