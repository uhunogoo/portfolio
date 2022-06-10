import gsap from 'gsap'
import * as THREE from 'three'

import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'
import bell from '../../asstes/sounds/CinematicStrike.wav?url'

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
        this.resources = this.experience.resources
        
        // Defaults
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
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
    animationControll() {
        gsap.set('.preload', {autoAlpha: 1})
        const playHitSound = () => {
            this.hitSound.currentTime = 0
            this.hitSound.play()
        }

        // Create animations
        this.playOutAnimation = gsap.timeline({ 
            paused: true,
            onStart: () => {
                playHitSound()
            },
        })
        this.playInAnimation = gsap.timeline({ 
            paused: true,
            onComplete: () => {
                document.querySelector('.preload').addEventListener('click', () => {
                    this.trigger( 'preloadWasClicked' )
                    this.playOutAnimation.play()
                })
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
        const plane = new THREE.PlaneGeometry(2, 2, 300, 300)
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
        this.playInAnimation.from('.text', {
            y: 40,
            scale: 1.2,
            opacity: 0,
            stagger: {
                amount: 0.2
            }
        }, '<+=30%')
    }
    outAnimation() {
        this.playOutAnimation.to(this.mesh.material.uniforms.uProgress, {
            value: 0,
            duration: 1.4,
            ease: 'power2'
        })
        this.playOutAnimation.to('.text', {
            scale: 2,
            opacity: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power1.in'
        }, 0)
        this.playOutAnimation.to('.title-decor', {
            rotate: '360deg',
            scale: 0.7,
            opacity: 0,
            duration: 1,
            ease: 'power1'
        }, 0)
        this.playOutAnimation.to('.preload', {
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power1'
        }, '<+=80%')
        this.playOutAnimation.timeScale(1.25)
    }
    resize() {
        const aspect = this.experience.sizes.width / this.experience.sizes.height
        this.mesh.material.uniforms.uAspect.value = aspect
    }
}