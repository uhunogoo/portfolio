
import { Raycaster } from 'three'
import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'
import gsap from 'gsap'


import bell from '../../../asstes/sounds/intro.mp3?url'
import splash from '../../../asstes/sounds/splash.mp3?url'

export default class PointsAnimation extends EventEmitter {
    constructor ( world, UI ) {
        super()

        // Setup
        this.world = world
        this.uiAnimations = UI
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.points = this.experience.points.list
        this.camera = this.experience.camera.instance
        this.cameraGroup = this.experience.camera.instanceGroup
        this.mouse = this.experience.mouse
        this.preload = this.experience.preload.mesh
        this.bloomPass = this.experience.renderer.unrealBloomPass
        this.bloomPass = this.experience.renderer.unrealBloomPass
        
        
        // Defaults
        this.pointInfoOpen = false
        this.pointsGroup = this.world.children.find( child => child.name === 'pointsGroup' )
        this.cloudsGroup = this.world.children.find( child => child.name === 'cloudsGroup' )
        this.raycaster = new Raycaster()
        this.intersect = null
        this.clickedPoint = null
        this.hitSound = new Audio( bell )
        this.outSound = new Audio( splash )

        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75

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
                tl.add( this.uiAnimations.showMenu().timeScale(3).reverse())                
                tl.add( this.towerAnimation(target[0]), 0)                
                tl.add( parameters.function.play(), 0 )

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

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Points')

            this.debugFolder
                .add( this.parameters.lookAt, 'x')
                .min(-12)
                .max(12)
                .step(0.001)
            this.debugFolder
                .add( this.parameters.lookAt, 'y')
                .min(-12)
                .max(12)
                .step(0.001)
            this.debugFolder
                .add( this.parameters.lookAt, 'z')
                .min(-12)
                .max(12)
                .step(0.001)
        }

        this.showNav()
        this.startStyles()
    }
    startStyles() {
        gsap.set('.work', 
        {
            scale: 0.5,
            y: '180%',
            opacity: 0
        })
        
        gsap.set( '#myPhoto', { clipPath: 'inset(0% 0% 100% 0%)' }) // to bottom
        gsap.set( '#myPhoto img', { scale: 1.4 })
        gsap.set( '.content__title span', { yPercent: 100 })
        gsap.set( '.animate-text', { opacity: 0, y: 100 })
        gsap.set( '.content__text span.icon', { opacity: 0, scale: 0.1 })
        gsap.set( '.content__links img', { opacity: 0, scale: 0.1 })
        gsap.set( '.content .decor', { opacity: 0, scale: 1.6, rotate: '90deg', x: '100%', y: '-60%' })
    }
    showNav() {
        const clear = () => {
            this.showPoints.kill()
        }
        this.showPoints = gsap.timeline({ 
            paused: true,
            onComplete: clear
        })        
        this.pointsScale = this.pointsGroup.children[0].children.map( el => el.scale )
        this.cloudssScale = this.cloudsGroup.children.map( el => el.scale )
        
        this.showPoints.to( this.pointsScale, {
            x: 0.1,
            y: 0.1,
            ease: 'back',
            stagger: 0.2
        })
        this.showPoints.from( this.cloudssScale, {
            x: 0,
            y: 0,
            ease: 'back',
            stagger: 0.02
        }, 0.15)
    }
    towerAnimation(target) {  
        const lookAt = (target.id > 0) ? 5 : 0   
         
        
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
            z: lookAt,
            ease: 'power3.inOut'
        }, '<')
        tl.to(this.cameraGroup.rotation, {
            x: 0,
            y: 0,
            duration: 1,
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
    
    mouseClick() {
        const playHitSound = () => {
            this.outSound.currentTime = 0
            this.outSound.play()
        }
        const openInformationBlock = (targetPoint) => {
            this.trigger('menuWasOpen')

            // Set current tab as active
            targetPoint.element.classList.add( 'active' )
            this.showInformation(targetPoint)

            this.clean()
        }
        
        // Click part
        const clicked = this.mouse.clickTarget
        
        document.querySelector('.close_btn').classList.remove('active')
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
                this.trigger('menuWasClose')
                
                // Close button
                clicked.classList.add('active')
                
                playHitSound()
                this.open.reverse()
                this.pointInfoOpen = false

                gsap.utils
                    .toArray('.point__content')
                    .map( block => block.classList.remove('active') )
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
    }

    showInformation(target) {
        const playHitSound = () => {
            this.hitSound.currentTime = 0
            this.hitSound.play()
        }
        const clear = () => {
            this.open.kill()
        }
        this.open = gsap.timeline({ paused: true, onComplete: clear })

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
        gsap.fromTo('.close_btn g', { rotate: gsap.utils.wrap([-45, 45]), transformOrigin: '50% 50%' },{ 
            rotate: gsap.utils.wrap([0, 0]),
            transformOrigin: '50% 50%',
            duration: 0.8,
            ease: 'power1'
        }, 0.6)

        const tl = gsap.timeline({ paused: true, onStart: sound })

        tl.to(this.preload.material.uniforms.uProgress, {
            value: 1,
            duration: 1.6,
            ease: 'power2.inOut'
        }, 0)
        tl.to(this.bloomPass, {
            strength: 1,
            duration: 1.6,
            ease: 'power3.inOut'
        }, 0)
        tl.to([ '.informationPart', target.element], {
            autoAlpha: 1,
            duration: 0.1,
        }, 0)
        tl.to('.close_btn', {
            scale: 1,
            duration: 0.8,
            autoAlpha: 1,
            ease: 'back'
        }, 0.6)
        if (target.name === 'point-1') {
            // Open my works
            tl.add( this.myWorksBlockAnimation().timeScale(2.6), 0.65 )
        } else if (target.name === 'point-2') {
            // Open about me
            tl.add( this.aboutMeAnimation().timeScale(1.8), 0.65 )
        }

        return tl
    }
    myWorksBlockAnimation() {
        const tl = gsap.timeline()

        tl.to('.work', {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
        })
        tl.fromTo('.work__image', {scale: 0.6}, {
            scale: 1,
            stagger: 0.07,
            duration: 1.25,
            ease: 'power2'
        }, '<')
        tl.fromTo('.works__titles', {scale: 0.6, y: 60, opacity: 0}, {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2'
        }, 1)
        tl.fromTo('.works__arrow', {x: -20, opacity: 0}, {
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power1'
        }, 0.7)

        return tl
    }
    aboutMeAnimation() {
        const tl = gsap.timeline()
        tl.to('#myPhoto', {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
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
                each: 0.1,
                ease: 'power2'
            }
        }, '<')
        tl.to('.animate-text', {
            opacity: 1,
            y: 0,
            stagger: {
                each: 0.07,
                ease: 'power1'
            }
        }, '<')
        tl.to('.content__text span.icon', {
            opacity: 1,
            scale: 1,
            stagger: {
                amount: 0.4,
                ease: 'power3.in'
            }
        }, '<+=50%')
        tl.to('.content__links img', {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            ease: 'power3.in'
        }, '<-=50%')
        tl.to('.content .decor', { 
            opacity: 0.025, 
            scale: 1, 
            rotate: '0deg',
            x: '50%',
            duration: 1
        }, 0.3)
        
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
        const mouse = { x: this.mouse.x, y: this.mouse.y }
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
                this.tl.pointsShow( this.intersect.scale, {x: 0.15, y: 0.15} )
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
        this.raycasterAnimation()
    }
}
