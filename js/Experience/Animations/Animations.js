import Experience from '../Experience'
import CameraMove from './CameraMove'
import followingCursor from './MouseFollow'
import PointsAnimation from './PointsAnimtion'

export default class Animation {
    constructor (target) {
        // Defaults
        this.experience = new Experience()
        this.preload = this.experience.preload
        this.followingCursor = new followingCursor()
        this.cameraMove = new CameraMove( target )

        // Wait while preload animation will finished
        this.preload.on('preloadComplete', () => {
            this.cameraMove.towerInAnimation.play()

            this.cameraMove.on('animationComplete', () => {
                this.pointsAnimation = new PointsAnimation( target )  
            })
        })
        
        // Hide play text
        this.preload.on('preloadWasClicked', () => {
            this.followingCursor.showPlay.reverse()
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