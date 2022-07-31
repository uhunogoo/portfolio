import gsap from 'gsap'

import Experience from '../Experience'
import CameraMove from './CameraMove'
import followingCursor from './MouseFollow'
import PointsAnimation from './PointsAnimtion'
import UIAnimation from './UIanimations'

export default class Animation {
    constructor (target) {
        // Defaults
        this.experience = new Experience()
        this.preload = this.experience.preload
        this.followingCursor = new followingCursor()
        this.cameraMove = new CameraMove( target )
        this.uiAnimation = new UIAnimation()
        this.pointsAnimation = new PointsAnimation( target, this.uiAnimation ) 

        // Setup
        this.mainTimeline = gsap.timeline({ 
            paused: true,
            onComplete: () => {
                this.mainTimeline.kill()
                this.pointsAnimation.mouseMove()   
            }
        })
        this.mainTimeline.add( this.cameraMove.towerInAnimation.play().timeScale(1) )
        this.mainTimeline.add( this.uiAnimation.showMenu().timeScale(2), '-=1')
        this.mainTimeline.add( this.pointsAnimation.showPoints.play())
        
        // Hide play text
        this.preload.on('preloadWasClicked', () => {
            this.mainTimeline.play()
        })
    }
    update() {
        if ( this.cameraMove ) {
            this.cameraMove.update()
        }
        if ( this.uiAnimation ) {
            this.uiAnimation.update()
        }
    }
}