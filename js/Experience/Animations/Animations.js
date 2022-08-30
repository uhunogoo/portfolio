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
        this.uiAnimation = new UIAnimation( this.followingCursor )
        this.pointsAnimation = new PointsAnimation( target, this.uiAnimation ) 
        this.cameraMove = new CameraMove( target )
        this.load = false
        this.informationBlockOpen = false

        // Setup
        this.mainTimeline = gsap.timeline({ 
            paused: true,
            onComplete: () => {
                this.mainTimeline.kill()
                this.load = true
            }
        })
        this.mainTimeline.add( this.cameraMove.towerInAnimation.play().timeScale(1) )
        this.mainTimeline.add( this.uiAnimation.showMenu().timeScale(2), '-=1')
        this.mainTimeline.add( this.pointsAnimation.showPoints.play(), '<')
        
        // Hide play text
        this.preload.on('preloadWasClicked', () => {
            this.mainTimeline.play()
        })

        // Information blocks events
        this.pointsAnimation.on('menuWasOpen', () => this.informationBlockOpen = true)
        this.pointsAnimation.on('menuWasClose', () => this.informationBlockOpen = false)
    }
    mouseClick() {
        if ( this.pointsAnimation ) {
            this.pointsAnimation.mouseClick()
        }
    }
    deviceOrientation() {
        // Check iformation block state
        if ( this.informationBlockOpen ) return

        if ( this.cameraMove ) {
            this.cameraMove.deviceOrientation()
        }
    }
    mouseMove() {
        if ( this.followingCursor ) {
            this.followingCursor.mouseMove()
        }

        // Check iformation block state
        if ( this.informationBlockOpen ) return 
        
        if ( this.cameraMove ) {
            this.cameraMove.mouseMove()
        }
        if ( this.uiAnimation ) {
            this.uiAnimation.mouseMove()
        }
        if ( this.pointsAnimation ) {
            if (!this.load) return
            this.pointsAnimation.mouseMove()
        }
    }
    update() {
        if ( this.cameraMove ) {
            this.cameraMove.update()
        }
    }
    resize() {
        if ( this.uiAnimation ) {
            this.uiAnimation.resize()
        }
    }
}