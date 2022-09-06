import gsap from 'gsap'
import * as THREE from 'three'

import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'
import bell from '../../asstes/sounds/CinematicStrike.mp3?url'

// Postprocessing

// Preload shaders
import vertexShader from '../../asstes/shaders/preloader/preloadVertex.glsl?raw'
import fragmentShader from '../../asstes/shaders/preloader/preloadFragment.glsl?raw'

export default class Preload extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.mouse = this.experience.mouse
        this.resources = this.experience.resources
        this.bloomPass = this.experience.renderer.unrealBloomPass
        

        // Defaults
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
        this.preloadBlock = document.querySelector('.preload')
        this.playInAnimationComplete = false
        
        this.preloadHovered = false
        this.debug = this.experience.debug
        this.hitSound = new Audio( bell )

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Preload')
        }
        
        // actions
        this.preloadBG()
        this.animationControll()  
    }
    mouseClick() {
        if (this.playInAnimationComplete) {
            const target = this.mouse.clickTarget
            
            // Check target 
            if ( target && target.classList.contains('preload__enter') ) {

                target.classList.add('active')
                this.preloadBlock.classList.add('close')
                this.trigger( 'preloadWasClicked' )
                this.playOutAnimation.play()
            }

        }
    }
    animationControll() {
        gsap.set('.preload', {autoAlpha: 1})
        const beforeOut = () => {
            this.preload.kill()
            this.playInAnimation.kill()
            this.hitSound.currentTime = 0
            this.hitSound.play()
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
        this.playInAnimation = gsap.timeline({ 
            paused: true,

            onComplete: () => {
                this.playInAnimationComplete = true
            }
        })
        this.preload = gsap.timeline({
            paused: true,
            onComplete: () => this.playInAnimation.play()
        })


        // Call all base animations
        this.loading()
        this.inAnimation()
        this.outAnimation()

        // Start animation
        this.resources.on('loadingProgress', () => {
            gsap.fromTo(this.progress, { value: this.progress.value }, {
                value: this.resources.loaded / this.resources.toLoad,
                duration: 1,
                onUpdate: () => {
                    this.preload.play(this.progress.value)
                }
            })
        })
    }
    preloadBG() {
        const aspect = this.experience.sizes.width / this.experience.sizes.height
        const plane = new THREE.PlaneGeometry(2, 2, 200, 200)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 1 },
                uAspect: { value: aspect }
            },
            depthTest: false,
            transparent: true,
            vertexShader,
            fragmentShader,
        })
        
        this.mesh = new THREE.Mesh( plane, material )
        this.mesh.position.copy( this.experience.camera.instance.position )
        this.mesh.renderOrder = 1
        this.scene.add( this.mesh )

        // Debug renderer
        if (this.debug.active) {
            this.debugFolder
                .add( this.mesh.material.uniforms.uProgress, 'value')
                .min(0)
                .max(1)
                .step(0.001)
        }
    }
    loading() {  
        this.preload.from('#progress__bar', {
            duration: 2,
            scaleX: 0,
            transformOrigin: 'left center'
        })  
    }
    inAnimation() {
        this.playInAnimation.to('.title-decor', {
            rotate: '0',
            scale: 0.85,
            opacity: 0.025,
            duration: 2
        })
        this.playInAnimation.to('.preload__progress', {
            opacity: 0,
            y: -10,
            scale: 0.8,
            ease: 'power3.out',
        }, '<')
        this.playInAnimation.from('.text-part', {
            scale: 1.3,
            y: 200,
            opacity: 0,
            duration: 0.8,
            ease: 'power1'
        }, '<+=10%')
        this.playInAnimation.from('.text span', {
            y: 40,
            scale: 1.2,
            opacity: 0,
            stagger: {
                amount: 0.2
            }
        }, '<+=30%')
        this.playInAnimation.to('.preload__enter', {
            autoAlpha: 1,
            scale: 1,
            ease: 'power1.out',
        }, 0.8)
    }
    outAnimation() {
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
        this.playOutAnimation.to(this.bloomPass, {
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
    resize() {
        const aspect = this.experience.sizes.width / this.experience.sizes.height
        this.mesh.material.uniforms.uAspect.value = aspect
    }
}