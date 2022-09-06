import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin( ScrollTrigger )

import Experience from '../Experience'

export default class UIAnimation {
    constructor( mouseFollow ) {
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.sizes = this.experience.sizes
        this.deviceOrientationEvent = this.experience.deviceOrientationEvent
        
        // Defaults
        this.deviceOrientationSupported = false
        this.closeButtonHover = false
        this.mouseFollowAnimation = mouseFollow.followButtonIn
        this.preload = document.querySelector('.preload')        
        gsap.set('.title-decor div', { transformPerspective: '2000' })
        gsap.set('.compass__dots', {
            xPercent: -50,
            yPercent: -50
        })

        // Close button hover animation
        const closeButton = gsap.fromTo('.close_btn g', { rotate: gsap.utils.wrap([0, 0]), transformOrigin: '50% 50%' },{ 
            rotate: gsap.utils.wrap([-45, 45]),
            transformOrigin: '50% 50%',
            duration: 0.4,
            ease: 'power1'
        }, 0)

        // Add close button animation to mouse follow timeline
        this.mouseFollowAnimation.add( closeButton, 0 )

        // Scrolltrigger
        this.worksContainer = document.querySelector('.works')

        this.scroll()
    }
    scroll() {
        const sections = gsap.utils.toArray('.work')
        const sliderItems = sections
        const numSlides = sliderItems.length
        const lastBlockLeft = sections[ sections.length - 1]

        // slides positions
        for (let i = 0; i < numSlides; i++) {
            gsap.set(sliderItems[i], { xPercent: i * 100, y: 0 })
        }

        const scrollX = () => {
            return this.sizes.width - ( numSlides * lastBlockLeft.clientWidth + 40)
        }
        const scrollY = () => {
            const widthProportion = (numSlides * lastBlockLeft.clientWidth + 40) / this.sizes.width
            const percentageValue = widthProportion * 100
            return percentageValue
        }
        
        gsap.set('.works__wrap', { height: `${ scrollY() * 0.75 }%` })
        gsap.set('.works__sticky', { height: this.worksContainer.clientHeight })
        gsap.set('.works__scroller', { width: `${ scrollY() }%` })

        let scrollTween = gsap.to('.works__scroller', {
            x: scrollX,
            ease: "none",
            scrollTrigger: {
                scroller: '.works',
                trigger: ".works__wrap",
                scrub: 1.1,
                start: "top top",
                end: 'bottom bottom',
                invalidateOnRefresh: true,
            }
        })
        
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
        let isCloseButton = false
        
        if (this.mouse.moveTarget['localName']) {
            
            isCloseButton = this.mouse.moveTarget.classList.contains('close_btn')
        }
        
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
        
        if ( isCloseButton ) {            
            if (!this.closeButtonHover) {
                this.mouseFollowAnimation.restart()
                this.closeButtonHover = true
            }
        } else {
            if (this.closeButtonHover) {
                this.mouseFollowAnimation.reverse()
                this.closeButtonHover = false
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