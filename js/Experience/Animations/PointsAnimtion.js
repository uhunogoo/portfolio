
import gsap from 'gsap'
import { SlowMo } from 'gsap/all'
gsap.registerPlugin( SlowMo )

import { Raycaster } from 'three'
import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'


import bell from '../../../asstes/sounds/intro.mp3?url'
import splash from '../../../asstes/sounds/splash.mp3?url'

export default class PointsAnimation extends EventEmitter {
    constructor ( world, UI, cameraMove ) {
        super()

        // Setup
        this.world = world
        this.uiAnimations = UI
		this.cameraMove = cameraMove
		
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.points = this.experience.points.list
		
		this.camera = this.experience.camera
        this.cameraEmpty = this.camera.instanceEmpty

        this.mouse = this.experience.mouse
        this.preload = this.experience.preload.mesh
        this.bloomPass = this.experience.renderer.unrealBloomPass
        this.bloomPass = this.experience.renderer.unrealBloomPass
        
        
        // Defaults
        this.pointInfoOpen = false
        this.pointsGroup = this.world.children.find( child => child.name === 'pointsGroup' )
        this.cloudsGroup = this.world.children.find( child => child.name === 'cloudsGroup' )
		this.towerGroup = this.world.children.find( child => child.name === 'towerGroup' )
		this.runic = this.towerGroup.children.find((child) => child.name === 'runic')

		this.pointsSettings = {
			scale: [],
			introScale: [],
			hoverScale: []
		}
		this.pointsGroup.children[0].children.map( el => { 
			// Push data to points object
			this.pointsSettings.scale.push( el.scale )
			this.pointsSettings.introScale.push({ v: 0 })
			this.pointsSettings.hoverScale.push({ v: 0 })
		})
        
		this.raycaster = new Raycaster()
        this.intersect = null
        this.clickedPoint = null
        this.hitSound = new Audio( bell )
        this.outSound = new Audio( splash )

        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75

        gsap.registerEffect({
            name: "openInformationBlock",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                      duration: 1,
                      ease: 'none'
                    },
                })
                tl.add( this.uiAnimations.showMenu().timeScale(3).reverse())                
                tl.add( this.towerAnimation(target[0]).timeScale(2), 0)                
                tl.add( parameters.function.play(), 0 )

                return tl
            }
        })
		this.runicAnimation = gsap.timeline({ paused: true })
		this.runicAnimation.to( this.runic.material.uniforms.uFinal, {
			value: 1,
			duration: 0.7
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
		this.pointsScaleCalculation()
    }

	cameraUpdate() {
		gsap.to( this.cameraEmpty.rotation, {
			y: Math.PI * 2,
			onUpdate: () => {
				this.camera.instance.position.copy( this.camera.cameraPosition() )
				this.camera.instance.lookAt( this.camera.cameraLookAt() )
			},
			duration: 20,
			repeat: -1,
			ease: 'none'
		})
	}

    startStyles() {
        gsap.set('.work', { scale: 0.5, y: '180%', opacity: 0 })
        gsap.set( '#myPhoto', { clipPath: 'inset(0% 0% 100% 0%)' }) // to bottom
        gsap.set( '#myPhoto img', { scale: 1.4 })
        gsap.set( '.content__title span', { yPercent: 100 })
        gsap.set( '.animate-text', { opacity: 0, y: 100 })
        gsap.set( '.content__text span.icon', { opacity: 0, scale: 0.1 })
        gsap.set( '.content__links img', { opacity: 0, scale: 0.1 })
        gsap.set( '.content .decor', { opacity: 0, scale: 1.6, rotate: '90deg', x: '100%', y: '-60%' })
    }
	pointsScaleCalculation() {
		const scales = this.pointsSettings.scale
		const { introScale, hoverScale } = this.pointsSettings

		for ( let id in scales) {
			const combineScale = introScale[ id ].v + hoverScale[ id ].v
			scales[ id ].setScalar( combineScale )
		}
	}
    showNav() {
        const clear = () => {
            this.showPoints.kill()
        }
        this.showPoints = gsap.timeline({ 
            paused: true,
            onComplete: clear,
			onUpdate: () => this.pointsScaleCalculation()
        }) 
        this.cloudssScale = this.cloudsGroup.children.map( el => el.scale )
        
        this.showPoints.to( this.pointsSettings.introScale, {
            v: 0.1,
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
		
        const tl = gsap.timeline({ 
			smoothChildTiming: true, 
			defaults: { ease: 'none' },
			onUpdate: () => this.pointsScaleCalculation()
		})

        tl.to( this.pointsSettings.introScale, {
            v: 0,
			overwrite: true,
			immediateRender: true,
            stagger: 0.1,
            ease: 'power3.inOut'
        })
		tl.add( this.cameraMove.animateCamera( target.id ), 0 )

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
            ease: 'power2'
        }, 0)
        tl.to(this.bloomPass, {
            strength: 1,
            duration: 1.6,
            ease: 'power2'
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
            tl.add( this.myWorksBlockAnimation().timeScale(2.6), 0.45 )
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
			gsap.to(this.pointsSettings.hoverScale, {
				v: 0,
				duration: 0.3,
				ease: 'power2',
				onUpdate: () => this.pointsScaleCalculation()
			})
            this.intersect = null
        }
    }
    raycasterAnimation() {
        const mouse = { x: this.mouse.x, y: this.mouse.y }
        this.raycaster.setFromCamera(mouse, this.camera.instance)
        const intersects = this.raycaster.intersectObjects( this.pointsGroup.children )

        if( intersects.length > 0 ) {
            if (this.intersect !== intersects[0].object) {
                this.clean()
                this.intersect = intersects[0].object    
                
                // Cursor pointer
                document.documentElement.style.cursor = 'pointer'
				const point = this.points.find( (el, i) => el.name === this.intersect.name)
				const id = point.id
				
				// SCALE POINTS ON HOVER
				gsap.to(this.pointsSettings.hoverScale[id], {
					v: 0.05,
					duration: 0.3,
					ease: 'power2',
					onUpdate: () => this.pointsScaleCalculation()
				})

				if ( this.intersect.name === 'point-1' ) {
					if ( this.runicAnimation.progress() === 0) {
						this.runicAnimation.play(0)
					}
				}
            }
        } else {
            // Cursor default
            if (document.documentElement.style.cursor === 'pointer') {
                document.documentElement.style.cursor = 'default'
            }
			if ( this.runicAnimation.progress() !== 0) {
				this.runicAnimation.reverse()
			}
            this.clean()
        }
    }
    mouseMove() {
        this.raycasterAnimation()
    }
}
