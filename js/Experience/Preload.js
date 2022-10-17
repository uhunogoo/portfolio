import gsap from 'gsap'

import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'

// Postprocessing

// Preload shaders
import vertexShader from '../../asstes/shaders/preloader/preloadVertex.glsl?raw'
import fragmentShader from '../../asstes/shaders/preloader/preloadFragment.glsl?raw'
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import AddAudio from './World/Audio'

export default class Preload extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene1 = this.experience.scene1
        this.mouse = this.experience.mouse
        this.resources = this.experience.resources
		this.addAudio = new AddAudio()

        
        // Defaults
		this.audios = null
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
        this.preloadBlock = document.querySelector('.preload')
        this.playInAnimationComplete = false
        
        this.preloadHovered = false
        this.debug = this.experience.debug

        // actions
        this.loadingAnimation()
        this.preloadBG()
        this.animationControll()  
    }
    
    animationControll() {
        this.playInAnimation = gsap.timeline({ 
            paused: true,
            onUpdate: () => {
                const progress =  this.playInAnimation.progress()
                if (progress < 0.8 || this.playInAnimationComplete) return
                
                // Intro animation was ended
                this.playInAnimationComplete = true

                // Set support class for enter button
                document
                    .querySelector('.preload__enter')
                    .classList.add('preload__enter_animated') 

                // Enter button letters rainbow 
                gsap.to('.preload__enter span', {
                    keyframes: {
                        '50%': { color: '#F3B754', ease: 'power1.out' },
                        '100%': { color: '#121F2F', ease: 'power1.in' },
                    },
                    duration: 0.4,
                    stagger: 0.05
                })
            }
        })
        // Call all base animations
        this.inAnimation()
    }
    inAnimation() {
        this.playInAnimation.to('.preload__progress', {
            opacity: 0,
            y: -10,
            scale: 0.8,
            ease: 'power3.out',
        }, 0)
        this.playInAnimation.to('.preload__enter', {
            autoAlpha: 1,
            scale: 1,
            ease: 'power1.out',
        }, 0.8)
    }
    preloadBG() {
        const aspect = this.experience.sizes.width / this.experience.sizes.height
        const plane = new PlaneGeometry(2, 2, 200, 200)
        const material = new ShaderMaterial({
            uniforms: {
                uProgress: { value: 1 },
                uAspect: { value: aspect }
            },
            transparent: true,
            vertexShader,
            fragmentShader,
        })
        
        this.mesh = new Mesh( plane, material )
        this.mesh.position.z = -2
        this.scene1.add( this.mesh )
    }
    loadingProcess() {
        gsap.fromTo(this.progress, { value: this.progress.value }, {
            value: this.resources.loaded / this.resources.toLoad,
            duration: 1,
            onUpdate: () => {
                this.preload.play(this.progress.value)
            }
        })
    }
    loadingAnimation() {
        // Start animation
        this.pageIntro = gsap.timeline({
            paused: true,
        })
        this.preload = gsap.timeline({
            paused: true,
            onStart: () => this.pageIntro.play(),
            onComplete: () => this.playInAnimation.play()
        })

        // Animation on content loading 
        this.preload.from('#progress__bar', {
            duration: 2,
            scaleX: 0,
            transformOrigin: 'left center'
        })

        // Animation on page load 
        this.pageIntro.to('.title-decor', {
            rotate: '0',
            scale: 0.85,
            opacity: 0.025,
            duration: 2
        }, 0)
    }
    loadingComplete() {
        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Preload')
        }
        // Debug renderer
        if (this.debug.active) {
            this.debugFolder
                .add( this.mesh.material.uniforms.uProgress, 'value')
                .min(0)
                .max(1)
                .step(0.001)
        }
        
        const beforeOut = () => {
            this.preload.kill()
            this.playInAnimation.kill()
			
			// Play audio
            this.audios.enterSound.play()
        }
        const clear = () => {
            this.playOutAnimation.kill()
        }
        // Create animations
        this.playOutAnimation = gsap.timeline({ 
            paused: true,
            onStart: beforeOut,
            onComplete: clear
        })
        this.playOutAnimation.to('.preload__enter', {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power4'
        }, 0)


        this.outAnimation()
    }
    outAnimation() {
        const bloomPass = this.experience.renderer.unrealBloomPass

        this.playOutAnimation.to('.text-part', {
            scale: 0.7,
            opacity: 0,
            duration: 0.6,
            ease: 'power3'
        })
        this.playOutAnimation.to('.text span', {
            scale: 0.2,
            y: gsap.utils.wrap( [20, -20] ),
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power1'
        }, 0.2)
        this.playOutAnimation.to(this.mesh.material.uniforms.uProgress, {
            value: 0,
            duration: 2,
            ease: 'power3'
        }, 0.2)
        this.playOutAnimation.to(bloomPass, {
            strength: 0.12,
            duration: 1.5,
            ease: 'power3'
        }, 0.2)
        this.playOutAnimation.to('.title-decor', {
            rotate: '180deg',
            scale: 4,
            opacity: 0,
            duration: 1.2,
            ease: 'none'
        }, 0.2)
        this.playOutAnimation.to('.preload', {
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power1'
        }, 0.8)
        this.playOutAnimation.timeScale(0.9)
    }

    mouseClick() {
        if (this.playInAnimationComplete) {
            const target = this.mouse.clickTarget
            
            // Check target 
            if ( target && target.classList.contains('preload__enter') ) {

				// Add audio
				this.audios = this.addAudio.createAudio()

                target.classList.add('active')
                this.preloadBlock.classList.add('close')
                this.trigger( 'preloadWasClicked' )
                this.playOutAnimation.play()
            }

        }
    }
    resize() {
        const aspect = this.experience.sizes.width / this.experience.sizes.height
        this.mesh.material.uniforms.uAspect.value = aspect
    }
}

