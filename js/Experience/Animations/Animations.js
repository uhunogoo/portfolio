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

        // Wait while preload animation will finished
        this.preload.on('preloadComplete', () => {
            this.cameraMove = new CameraMove( target )
            this.cameraMove.on('animationComplete', () => {
                this.pointsAnimation = new PointsAnimation( target )  
            })
        })
        
        // Play animation for preload hovering
        this.preload.on('preloadHovered', () => {
            this.followingCursor.showPlay.play()
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