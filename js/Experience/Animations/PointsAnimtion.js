
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

        this.closeBtn()
        this.showNav()
        this.navigationBtn() 
        this.startStyles()        
    }
    startStyles() {
        gsap.set('.work', 
        {
            clipPath: 'inset(15% round 15px)',
            y: '180%',
            opacity: 0
        })
    }
    showNav() {
        this.showPoints = gsap.timeline({ paused: true })        
        const pointsScale = this.pointsGroup.children[0].children.map( el => el.scale )
        
        this.showPoints.to( pointsScale, {
            x: 0.1,
            y: 0.1,
            ease: 'back',
            stagger: 0.2
        })
    }
    closeBtn() {
        const playHitSound = () => {
            this.outSound.currentTime = 0
            this.outSound.play()
        }
        if( this.pointInfoOpen ) {
            const closeBtn = document.querySelector('.close_btn')
            closeBtn.addEventListener('click', () => {
                this.closeButtonClicked = true
                this.trigger('menuWasClose')

                playHitSound()
                this.open.reverse()
                this.pointInfoOpen = false
            })
        }
    }
    openMenu(target) {
        const playHitSound = () => {
            this.hitSound.currentTime = 0
            this.hitSound.play()
        }
        this.open = gsap.timeline({
            paused: true,
            defaults: {
              duration: 1,
              ease: 'power4.out'
            },
            onStart: () => {
                playHitSound()
            },
        })

        this.open.to(this.world.rotation, {
            y: '-=' + target.animationParameters.angle,
            duration: 0.5,
            ease: 'back(1.2)'
        })
        this.open.to(this.parameters.lookAt, {
            duration: 0.5,
            y: target.position.y,
        }, '<')
        this.open.to(this.camera.position, {
            duration: 0.5,
            x: target.animationParameters.radius + 0.2,
            y: target.position.y + 0.75,
            z: target.animationParameters.radius + 0.2,
            ease: 'power3.inOut'
        }, '<')

        this.open.add( this.uiAnimation.showMenu().timeScale(3).reverse(), 0)
        this.open.to([ '.informationPart', target.element], {
            autoAlpha: 1,
            duration: 0.1
        })
        this.open.to(this.preload.material.uniforms.uProgress, {
            value: 1,
            duration: 1.6,
            ease: 'power1'
        }, 0.15)
        this.open.to('.work', {
            clipPath: 'inset(0% round 15px)',
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
        }, '<+=25%')
        this.open.to('.work__image', {
            scale: 1.1,
            stagger: 0.07,
            duration: 1.25,
            ease: 'power2'
        }, '<')


        this.open.timeScale(2).play()
    }
    clickHandler(target) {
        this.trigger('menuWasOpen')
        this.openMenu(target)

        if(!this.closeButtonClicked) {
            this.closeBtn()
        }
    }
    clean() {
        if (this.intersect) {
            this.tl.kill()
            
            this.tl = gsap.timeline()
            this.tl.pointsShow( this.intersect.scale, {x: 0.1, y: 0.1} )

            this.intersect = null
        }
    }
    
    navigationBtn() {
        const navigationBtn = document.querySelectorAll('.menu__item')
        navigationBtn.forEach( button => {
            button.addEventListener('click', () => {                
                if (!this.pointInfoOpen) {
                    this.pointInfoOpen = true
                    const name = button.dataset.name
                    const targetPoint = this.points.find( point => point.name === name )
                    this.clickHandler( targetPoint )
                }
            })
        })
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
                document.addEventListener('click', () => {                    
                    if (this.intersect && !this.pointInfoOpen) {
                        this.pointInfoOpen = true
                        const targetPoint = this.points.find( point => point.position.equals( this.intersect.position ) )
                        this.clickHandler( targetPoint )
                    }
                })
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