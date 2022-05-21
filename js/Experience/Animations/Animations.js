import Experience from '../Experience'
import CameraMove from './CameraMove'
import PointsAnimation from './PointsAnimtion'

export default class Animation {
    constructor (target) {
        this.experience = new Experience()
        this.preload = this.experience.preload

        // Wait while preload animation will finished
        this.preload.on('preloadComplete', () => {   
            // Animations
            this.cameraMove = new CameraMove( target )
            
            // Show points after camera animation
            this.cameraMove.on('animationComplete', () => {
                this.pointsAnimation = new PointsAnimation()
            })
        })
    }
    update() {
        if ( this.cameraMove ) {
            this.cameraMove.update()
        }
        if ( this.pointsAnimation ) {
            this.pointsAnimation.update()
        }
    }
}