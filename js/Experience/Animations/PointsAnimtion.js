
import * as _ from 'lodash-es'
import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'

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
        
        
        // Defaults
        this.pointInfoOpen = false
        this.pointsGroup = this.world.children.find( child => child.name === 'pointsGroup' )
        
        this.raycaster = new THREE.Raycaster()
        this.intersect = null
        this.clickedPoint = null

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
                    x: parameters.radius,
                    y: parameters.y + 0.75,
                    z: parameters.radius,
                    ease: 'power3.inOut'
                }, '<')

                return tl
            }
        })

        this.closeBtn()
        
        const throttleFunction = _.throttle(() => {           
            this.raycasterAnimation() 
        }, 90)
        this.mouse.on('mouseMove', () => {
            throttleFunction()
        })
        
    }
    closeBtn(target) {
        if( this.pointInfoOpen ) {
            const closeBtn = target.querySelector('.close_btn')
            closeBtn.addEventListener('click', () => {
                this.camera.layers.enable(0)
                this.open.timeScale(2).reverse()
                this.pointInfoOpen = false
            })
        }
    }
    openMenu(target) {
        this.open = gsap.timeline({
            paused: true,
            defaults: {
              duration: 1,
              ease: 'power4.out'
            },
            onStart: () => this.camera.layers.enable(1),
            onComplete: () => this.camera.layers.disable(0),
            onReverseComplete: () => this.camera.layers.disable(1),
        })

        this.open.to(target.element, {
            autoAlpha: 1,
            duration: 0.1
        })
        
        this.open.to('.ui-layer', {
            scale: 1.1,
            opacity: 0,
            duration: 0.5
        })
        this.open.to(this.preload.material.uniforms.uProgress, {
            value: 1,
            duration: 1.6,
            ease: 'power1'
        }, 0.15)
        this.open.fromTo('.work', 
        {
            clipPath: 'inset(15% round 15px)',
            y: '180%',
            opacity: 0
        }, {
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
        this.open.fromTo('.work__name span', { y: '150%', skewY: '5deg', scale: 1.2 }, {
            y: 0,
            scale: 1,
            skewY: 0,
            transformOrigin: 'left center'
        }, '<+=25%')
        this.open.fromTo('.work__technology span', { y: '150%', scale: 1.4 }, {
            y: 0,
            scale: 1,
            transformOrigin: 'left center'
        }, '<+=20%')


        this.open.play()
    }
    clickHandler(target) {
        this.openMenu(target)
        this.closeBtn(target.element)
    }
    clean() {
        if (this.intersect) {
            this.tl.kill()
            
            this.tl = gsap.timeline()
            this.tl.pointsShow( this.intersect.scale, {x: 0.1, y: 0.1} )

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
}