
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
                gsap.to(target, {
                    autoAlpha: 0
                })
            })

            this.pointInfoOpen = false
        }
    }
    clickHandler(target) {
        console.log( target )
        gsap.to(target.element, {
            autoAlpha: 1
        })

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
            this.clean()
        }
    }
    update() {
        // this.raycasterAnimation()
    }
}