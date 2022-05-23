
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
        this.firstDraw = false
        this.worldGroup = this.scene.children.find( child => child.name === 'worldGroup' )
        this.towerGroup = this.worldGroup.children.find(group => group.name === 'towerGroup')
        
        this.raycaster = new THREE.Raycaster()
        this.intersect = null
        this.clickedPoint = null

        this.parameters = this.experience.camera.parameters
        this.parameters.angle = 1.75
        this.parameters.radius = 4.5
        this.parameters.cameraY = 0.75


        // Animation
        this.tl = gsap.timeline()
        gsap.registerEffect({
            name: "pointsShow",
            extendTimeline:true,
            effect: (target, parameters) => {                
                const tl = gsap.timeline({
                    defaults: {
                        duration: 0.3,
                        ease: 'power2.inOut'
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
    closeBtn() {
        const closeBtn = [...document.querySelectorAll('.close_btn')]
        closeBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                const { angle, radius } = this.parameters

                const animation = gsap.timeline()
                animation.clickEffect( btn, { 
                    y: 0.75,
                    angle, 
                    radius 
                })
                animation.to('.point__content', {
                    autoAlpha: 0,
                }, 0)
            })
        })
    }
    clickOnPoint(target) {
        const point = target 
        const animation = gsap.timeline()
        animation.clickEffect( point, { 
            y: point.position.y,
            angle: point.animationParameters.angle, 
            radius: point.animationParameters.radius
        })
        animation.to(point.element, {
            autoAlpha: 1,
        }, '<+=200%')

        const works = [...point.element.querySelectorAll('.work')]
        
        if ( works.length ) {
            animation.fromTo( '.work', {
                y: '150%',
            }, {
                y: 0,
                stagger: 0.15
            }, '<+=90%')
            animation.fromTo('.work__name', {
                y: '150%',
            }, {
                y: 0
            },'<+=90%')
            works.forEach( el => {
                animation.fromTo( el.querySelectorAll('.work__techonologys li'), {
                    x: 50,
                    opacity: 0,
                }, {
                    x: 0,
                    opacity: 1,
                    stagger: 0.15
                },'<')
            })
        }
    }
    raycasterAnimation() {
        const mouse = new THREE.Vector2( this.mouse.x, this.mouse.y )
        this.raycaster.setFromCamera(mouse, this.camera)
        const intersects = this.raycaster.intersectObjects( this.towerGroup.children, true )

        if( intersects.length ) {
            if (this.intersect !== intersects[0].object) {
                if(this.intersect) {
                    // Scale down animation
                    this.tl.pointsShow( this.intersect.scale, {x: 0.1, y: 0.1} )
                    this.intersect = null
                }

                if( intersects[0].object.type === 'Sprite' ) {
                    this.intersect = intersects[0].object

                    // Scale up animation
                    this.tl.pointsShow( this.intersect.scale, {x: 0.2, y: 0.2} )
                    document.addEventListener('click', () => {
                        if (this.intersect) {
                            const targetPoint = this.points.find( point => point.position.equals( this.intersect.position ) )
                            this.clickOnPoint( targetPoint )
                        }
                    })
                } else {
                    if(this.intersect) {
                        // Scale down animation
                        this.tl.pointsShow( this.intersect.scale, {x: 0.1, y: 0.1} )
                        this.intersect = null
                    }
                }
            }
        } else {
            if(this.intersect) {
                this.tl.pointsShow( this.intersect.scale, {x: 0.1, y: 0.1} )
                this.intersect = null
            }
        }
    }
    update() {
        // this.raycasterAnimation()
    }
}