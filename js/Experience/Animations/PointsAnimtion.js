
import * as _ from 'lodash-es'
import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'
import UIAnimation from './UIanimations'

import bell from '../../../asstes/sounds/intro.mp3?url'
import splash from '../../../asstes/sounds/splash.mp3?url'

export default class PointsAnimation extends EventEmitter {
    constructor (world) {
        super()

        // Setup
        this.world = world
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.mouse = this.experience.mouse
        this.preload = this.experience.preload.mesh
        this.uiAnimation = new UIAnimation()
        
        
        // Defaults
        this.pointInfoOpen = false
        this.closeButtonClicked = false
        this.pointsGroup = this.world.children.find( child => child.name === 'pointsGroup' )
        this.raycaster = new THREE.Raycaster()
        this.intersect = null
        this.clickedPoint = null
        this.hitSound = new Audio( bell )
        this.outSound = new Audio( splash )

        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75
        this.parameters.radius = 4.5
        this.parameters.cameraY = 0.75


        // Animation
        gsap.registerEffect({
            name: "pointsShow",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                        duration: 0.3,
                        ease: 'power2'
                    },
                })
                tl.to(target, {
                    x: parameters.x,
                    y: parameters.y,
                })

                return tl
            }
        })
        gsap.registerEffect({
            name: "openInformationBlock",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                      duration: 1,
                      ease: 'power4.out'
                    },
                    onReverseComplete: () => {
                        const tl = gsap.timeline()
                        tl.pointsShow( this.pointsScale, {x: 0.1, y: 0.1} )
                    }
                })
                tl.add( this.uiAnimation.showMenu().timeScale(3).reverse())                
                tl.add( this.towerAnimation(target[0]), 0)                
                tl.add( parameters.function.play(), '<+=25%' )

                return tl
            }
        })
        gsap.registerEffect({
            name: "clickEffect",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                        duration: 2,
                        ease: 'power4.inOut'
                    },
                })
                tl.to(this.parameters.lookAt, {
                    y: parameters.y,
                })
                tl.to(this.world.rotation, {
                    y: Math.PI * parameters.angle
                }, '<')
                tl.to(this.camera.position, {
                    x: parameters.x,
                    y: parameters.y + 0.75,
                    z: parameters.z,
                    ease: 'power3.inOut'
                }, '<')

                return tl
            }
        })

        this.showNav()
        this.startStyles()
        
        this.clickHandler()
    }
    startStyles() {
        gsap.set('.work', 
        {
            clipPath: 'inset(15% round 15px)',
            y: '180%',
            opacity: 0
        })
        // gsap.set( '#myPhoto', { clipPath: 'inset(100% 0% 0% 0%)' }) // to top
        gsap.set( '#myPhoto', { clipPath: 'inset(0% 0% 100% 0%)' }) // to bottom
        gsap.set( '#myPhoto img', { scale: 1.4 })
        gsap.set( '.content__title span', { yPercent: 100 })
        gsap.set( '.animate-text', { opacity: 0, y: 100 })
        gsap.set( '.content__text .icon', { opacity: 0, scale: 0.1 })
        gsap.set( '.content__links', { opacity: 0, scale: 0.1 })
    }
    showNav() {
        this.showPoints = gsap.timeline({ paused: true })        
        this.pointsScale = this.pointsGroup.children[0].children.map( el => el.scale )
        
        this.showPoints.to( this.pointsScale, {
            x: 0.1,
            y: 0.1,
            ease: 'back',
            stagger: 0.2
        })
    }
    towerAnimation(target) {        
        const tl = gsap.timeline()
        tl.to(this.pointsScale, {
            x: 0,
            y: 0,
            stagger: 0.1,
            ease: 'power3.inOut'
        })
        tl.to(this.world.rotation, {
            y: '-=' + target.animationParameters.angle,
            duration: 1,
            ease: 'power3.inOut'
        }, '<')
        tl.to(this.parameters.lookAt, {
            duration: 1,
            y: target.position.y,
            ease: 'power3.inOut'
        }, '<')
        tl.to(this.camera.position, {
            duration: 1,
            x: target.animationParameters.radius + 0.2,
            y: target.position.y + 0.75,
            z: target.animationParameters.radius + 0.2,
            ease: 'power3.inOut'
        }, '<')

        return tl
    }
    
    clickHandler() {
        const playHitSound = () => {
            this.outSound.currentTime = 0
            this.outSound.play()
        }
        const openInformationBlock = (targetPoint) => {
            this.trigger('menuWasOpen')
            this.showInformation(targetPoint)
        }
        document.addEventListener('click', (e) => {
            const clicked = e.target
            // Click targets
            const clickOnCanvas = clicked.classList.contains('webgl')
            const clickOnCloseButton = clicked.classList.contains('close_btn')
            const clickOnNavigationButton = clicked.classList.contains('menu__item')

            if ( clickOnCanvas ) {
                if (this.intersect && !this.pointInfoOpen) {
                    this.pointInfoOpen = true
                    const targetPoint = this.points.find( point => point.position.equals( this.intersect.position ) )
                    
                    openInformationBlock(targetPoint)
                }
            } 
            if ( clickOnCloseButton ) {
                if( this.pointInfoOpen ) {
                    this.closeButtonClicked = true
                    this.trigger('menuWasClose')
        
                    playHitSound()
                    this.open.reverse()
                    this.pointInfoOpen = false
                }
            }
            if(clickOnNavigationButton) {
                if (!this.pointInfoOpen) {
                    this.pointInfoOpen = true

                    const name = clicked.dataset.name
                    const targetPoint = this.points.find( point => point.name === name )
                    
                    openInformationBlock(targetPoint)
                }
            }         
        })

        
    }

    showInformation(target) {
        const playHitSound = () => {
            this.hitSound.currentTime = 0
            this.hitSound.play()
        }
        this.open = gsap.timeline({ paused: true })

        const parameters = {}
        parameters.function = this.informationBlockAnimation(target, playHitSound)

        this.open.openInformationBlock( target, parameters )
        this.open.play()
    }

    /**
     * 
     * @param {*} target 
     * @param {*} sound 
     * @returns timeline
     */
    informationBlockAnimation(target, sound) {
        const tl = gsap.timeline({ paused: true, onStart: sound })

        tl.to(this.preload.material.uniforms.uProgress, {
            value: 1,
            duration: 1,
            ease: 'power3'
        })
        tl.to([ '.informationPart', target.element], {
            autoAlpha: 1,
            duration: 0.1
        }, '<')

        if (target.name === 'point-1') {
            // Open my works
            tl.add( this.myWorksBlockAnimation().timeScale(2.6), '<+=10%' )
        } else if (target.name === 'point-2') {
            // Open about me
            tl.add( this.aboutMeAnimation().timeScale(1.6), '<+=10%' )
        }

        return tl
    }
    myWorksBlockAnimation() {
        const tl = gsap.timeline()

        tl.to('.work', {
            clipPath: 'inset(0% round 15px)',
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
        })
        tl.to('.work__image', {
            scale: 1.1,
            stagger: 0.07,
            duration: 1.25,
            ease: 'power2'
        }, '<')

        return tl
    }
    aboutMeAnimation() {
        const tl = gsap.timeline()
        tl.to('#myPhoto', {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'power4'
        })
        tl.to('#myPhoto img', {
            scale: 1,
            duration: 1,
            ease: 'power1'
        }, '<')
        tl.to('.content__title span', {
            yPercent: 0,
            stagger: {
                amount: 0.4,
                ease: 'power2'
            }
        }, '<')
        tl.to('.animate-text', {
            opacity: 1,
            y: 0,
            stagger: {
                amount: 0.5,
                ease: 'power3'
            }
        }, '<')
        tl.to('.content__text .icon', {
            opacity: 1,
            scale: 1,
            stagger: {
                amount: 0.4,
                ease: 'power3.in'
            }
        }, '<+=50%')
        tl.to('.content__links', {
            opacity: 1,
            scale: 1,
            ease: 'power3.in'
        }, '<-=50%')
        
        return tl
    }
    
    clean() {
        if (this.intersect) {
            this.tl.kill()

            this.tl = gsap.timeline()
            this.tl.pointsShow( this.pointsScale, {x: 0.1, y: 0.1} )

            this.intersect = null
        }
    }
    raycasterAnimation() {
        const mouse = new THREE.Vector2( this.mouse.x, this.mouse.y )
        this.raycaster.setFromCamera(mouse, this.camera)
        const intersects = this.raycaster.intersectObjects( this.pointsGroup.children )

        if( intersects.length > 0 ) {
            if (this.intersect !== intersects[0].object) {
                this.clean()
                this.intersect = intersects[0].object    
                
                // Cursor pointer
                document.documentElement.style.cursor = 'pointer'

                // Scale up animation
                if( this.tl ) this.tl.kill()
                
                this.tl = gsap.timeline()
                this.tl.pointsShow( this.intersect.scale, {x: 0.2, y: 0.2} )
            }
        } else {
            // Cursor default
            if (document.documentElement.style.cursor === 'pointer') {
                document.documentElement.style.cursor = 'default'
            }
            this.clean()
        }
    }
    mouseMove() {
        const throttleFunction = _.throttle(() => {           
            this.raycasterAnimation() 
        }, 90)
        this.mouse.on('mouseMove', () => {
            throttleFunction()
        })
    }
}