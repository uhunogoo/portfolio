import gsap from 'gsap'
import * as THREE from 'three'

import Experience from './Experience'
import EventEmitter from './Utils/EventEmitter'

// Preload shaders
import vertexShader from '../../asstes/shaders/preloader/preloadVertex.glsl?raw'
import fragmentShader from '../../asstes/shaders/preloader/preloadFragment.glsl?raw'

export default class Preload extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Defaults
        this.progress = { value: 0, complete: false }
        this.progressBlock = document.querySelector('.loader span')
        this.preloadHovered = false

        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Preload')
            this.debugFolder.close()
        }
        
        // actions
        this.preloadBG()
        this.animationControll()  
    }
    animationControll() {
        // Create animations
        this.playOutAnimation = gsap.timeline({ 
            paused: true, 
            onComplete: () => this.trigger('preloadComplete') 
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


        // Call base animations
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
        const plane = new THREE.PlaneGeometry(2, 2, 200, 200)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 1 },
                uTime: { value: 0 }
            },
            transparent: true,
            depthWrite: false,
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
        this.preload.from('.progress__bar', {
            duration: 2,
            scaleX: 0,
            transformOrigin: 'left center'
        })  
    }
    inAnimation() {
        this.playInAnimation.to('.progress__bar', {
            duration: 0.5,
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'right center'
        })
        this.playInAnimation.from('.title div', {
            y: 100,
            stagger: {
                amount: 0.7,
                from: 'center',
                ease: 'power1.out',
            }
        })
    }
    outAnimation() {
        this.playOutAnimation.to(this.mesh.material.uniforms.uProgress, {
            value: 0,
            duration: 2.5,
            ease: 'power1'
        })

        this.playOutAnimation.to('.preload', {
            autoAlpha: 0,
        }, '<+=60%')
    }
}