import CameraMove from './CameraMove'
import PointsAnimation from './PointsAnimtion'

export default class Animation {
    constructor (target) {
        // Animations
        this.cameraMove = new CameraMove( target )
        
        // Events
        this.cameraMove.on('animationComplete', () => {
            this.pointsAnimation = new PointsAnimation()
        })
    }
    update() {
        this.cameraMove.update()
        if ( this.pointsAnimation ) {
            this.pointsAnimation.update()
        }
    }
}