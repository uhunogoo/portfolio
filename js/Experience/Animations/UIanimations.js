import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin( ScrollTrigger )

import Experience from '../Experience'

export default class UIAnimation {
    constructor() {
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.sizes = this.experience.sizes
        this.deviceOrientationEvent = this.experience.deviceOrientationEvent
        
        // Defaults
        this.deviceOrientationSupported = false
        this.closeButtonHover = false
        this.preload = document.querySelector('.preload')        
        gsap.set('.title-decor div', { transformPerspective: '2000' })
        gsap.set('.compass__dots', {
            xPercent: -50,
            yPercent: -50
        })

        // Close button hover animation
        this.closeButton = gsap.fromTo('.close_btn g', { rotate: gsap.utils.wrap([0, 0]), transformOrigin: '50% 50%' },{ 
            rotate: gsap.utils.wrap([-45, 45]),
            transformOrigin: '50% 50%',
            duration: 0.4,
            ease: 'power1'
        })

        this.enterButton = gsap.to('.preload__enter span', {
            paused: true,
            keyframes: {
                '50%': { color: '#F3B754', ease: 'power1.out' },
                '100%': { color: '#121F2F', ease: 'power1.in' },
            },
            duration: 0.4,
            stagger: 0.05
        })

        // Add close button animation to mouse follow timeline

        // Scrolltrigger
        this.worksContainer = document.querySelector('.works')

        this.scroll()
    }
    scroll() {
        const sections = gsap.utils.toArray('.work')
        const sectionsTitles = gsap.utils.toArray('.work__info')
        const imagesWrapper = document.querySelector('.works__picture')
        const numSlides = sections.length
        const lastBlockLeft = sections[ sections.length - 1]

        // slides positions
        for (let i = 0; i < numSlides; i++) {
            gsap.set(sections[i], { xPercent: i * 100, y: 0 })
        }

        const scrollX = () => {
            return imagesWrapper.clientWidth - ( numSlides * lastBlockLeft.clientWidth)
        }
        const scrollY = () => {
            const widthProportion = (numSlides * lastBlockLeft.clientWidth) / imagesWrapper.clientWidth
            const percentageValue = widthProportion * 100
            return percentageValue
        }

        const animateWorkTitle = (self) => {
            // Calculate current ID
            const id = Math.round( self.progress * (sections.length - 1) )

            // Add class to active title
            sectionsTitles.forEach( (el, i) => {
                const isActive = el.classList.contains( 'active' )
                
                if ( i === id ) {
                    if( !isActive ) {
                        el.classList.add( 'active' )
                    }
                } else {
                    if( isActive ) {
                        el.classList.remove( 'active' )
                    }
                }
            })
        }
        
        gsap.set('.works__wrap', { height: `${ scrollY() * 0.75 }%` })
        gsap.set('.works__sticky', { height: this.worksContainer.clientHeight })
        gsap.set('.works__scroller', { width: `${ scrollY() }%` })

        const arrowAnimation = gsap.to( '.works__direction', { paused: true, x: '-20%', opacity: 0 })

        const scrollTween = gsap.to('.works__scroller', {
            x: scrollX,
            ease: "none",
            scrollTrigger: {
                scroller: '.works',
                trigger: ".works__wrap",
                scrub: 1.1,
                start: "top top",
                snap: {
                    snapTo: 1 / (sections.length - 1),
                    directional: false,
                    duration: 0.2,
                    inertia: true,
                    ease: 'power2',
                    onComplete: animateWorkTitle
                },
                onUpdate: (self) => {
                    const progress = self.progress * 10
                    arrowAnimation.progress( progress )
                },
                onToggle: animateWorkTitle,
                end: 'bottom bottom',
                invalidateOnRefresh: true,
            }
        })

        // Set start work title as active
        const activeTitle = sectionsTitles[ Math.round(scrollTween.progress() * (sections.length - 1)) ] 
        activeTitle.classList.add( 'active' )

        // Each section animation
        sections.forEach( section => {
            gsap.fromTo( section.querySelector('picture'), { x: '-40%', },{ 
                x: '-60%',
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    containerAnimation: scrollTween,
                    invalidateOnRefresh: true,
                    scrub: 0.01,
                    start: "0% 100%",
                    end: "100% 0%",
                }
            })
        })
    }
    showMenu() {
        gsap.set('.menu', {
            autoAlpha: 0,
            scale: 1.2,
            x: -100,
            y: 100,
            rotate: '-90deg',
        })
        gsap.set('.menu__item', { opacity: 0, scale: 0.2 })
        gsap.set('.menu__item span', { opacity: 0, y: 30, scale: 0.6 })
        gsap.set('.compass', { y: -50, autoAlpha: 0 })

        const menuAimation = gsap.timeline()
        menuAimation.to('.menu', {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: '-0',
            ease: 'power2',
            duration: 1
        })
        menuAimation.to('.menu__item', {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power1',
            stagger: 0.2
        }, '<+=80%')
        menuAimation.to('.menu__item span', {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power1',
            stagger: 0.2
        }, '<+=60%')
        menuAimation.to('.compass', {
            autoAlpha: 1,
            y: 0,
            ease: 'power1',
            duration: 0.75
        }, 0.25)

        return menuAimation
    }
    mouseMove() {
        const isPreloadHiden = this.preload.classList.contains('close')
        let isFocused = false
        
        if (!isPreloadHiden) {
            gsap.to('.title-decor div', {
                rotationY: -10 * this.mouse.x,
                rotationX: -10 * this.mouse.y,
                duration: 0.2, 
                ease: 'power1',
                transformOrigin:'50% 50%'
            })
        }
        // Run if device orientation is not using 
        if ( !this.deviceOrientationSupported && isPreloadHiden ) {
            gsap.to('.compass__dots', {
                xPercent: -50 - 6 * this.mouse.x
            })
        }

        // Buttons animation
        if (this.mouse.moveTarget['localName']) {
            // Detect block with button role
            const targetRole = () => {
                // Get target role
                let role = null
                if ( this.mouse.moveTarget.attributes.role ) {
                    role = this.mouse.moveTarget.attributes.role.value
                    // console.dir( this.mouse.moveTarget.attributes.role )
                } else if (this.mouse.moveTarget.parentElement.attributes.role) {
                    // Get parent element role if tagret isn't button
                    role = this.mouse.moveTarget.parentElement.attributes.role.value
                }
                return role
            }
            // Test if target role is button   
            isFocused = targetRole() === 'button'
            
            // Button animation part
            if ( isFocused ) {
                const isCloseButton = this.mouse.moveTarget.classList.contains('close_btn')
                const isEnterButton = this.mouse.moveTarget.classList.contains('preload__enter_animated')

                if (isCloseButton) {
                    this.closeButton.play()
                }
                
                if (isEnterButton) {                   
                    if ( this.enterButton.progress() === 0) {
                        this.enterButton.play(0)
                    }
                }
            } else {
                if ( this.closeButton.progress() !== 0) {
                    this.closeButton.reverse()
                }
                if ( this.enterButton.progress() !== 0) {
                    this.enterButton.restart().pause()
                }
            }
        }
        
    }
    deviceOrientation() {
        const isPreloadHiden = this.preload.classList.contains('close')
        if (this.deviceOrientationEvent.deviceOrientationTarget && isPreloadHiden) {
            const target = this.deviceOrientationEvent.deviceOrientationTarget
            const gammaAngle = 20
            
            const leftToRight = gsap.utils.clamp(-gammaAngle, gammaAngle,target.gamma )

            this.deviceOrientationSupported = (target.gamma ||target.beta ) ? true : false
            
            gsap.to('.compass__dots', {
                xPercent: -50 - 6 * (leftToRight / gammaAngle)
            })
            
        }
    }
    resize() {
        gsap.set('.works__sticky', { height: this.worksContainer.clientHeight })
    }
}