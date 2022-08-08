import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin( ScrollTrigger )

import Experience from '../Experience'

export default class UIAnimation {
    constructor( mouseFollow ) {
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.sizes = this.experience.sizes
        
        // Defaults
        this.closeButtonHover = false
        this.mouseFollowAnimation = mouseFollow.followButtonIn
        this.preload = document.querySelector('.preload')        
        gsap.set('.title-decor div', { transformPerspective: '2000' })
        
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
        const sections = gsap.utils.toArray('.works .work')
        const firstBlock = sections[ 0 ]
        const lastBlockLeft = sections[ sections.length - 1]
        const percentLeft = () => {
            const x = firstBlock.getBoundingClientRect().x * 2
            console.log( x )
            
            return this.sizes.width - (lastBlockLeft.offsetLeft + lastBlockLeft.clientWidth + x + 30)
        }

        let scrollTween = gsap.to(sections, {
            x: percentLeft,
            ease: "none", // <-- IMPORTANT!
            scrollTrigger: {
                invalidateOnRefresh: true,
                scroller: '.works',
                trigger: ".works__wrap",
                pin: true,
                scrub: 1.1,
                end: "+=1500"
            }
        });
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

        return menuAimation
    }
    mouseMove() {
        const isPreloadHiden = this.preload.classList.contains('close')
        const isCloseButton = this.mouse.moveTarget.classList.contains('close_btn')
        
        if (!isPreloadHiden) {
            gsap.to('.title-decor div', {
                rotationY: -10 * this.mouse.x,
                rotationX: -10 * this.mouse.y,
                duration: 0.2, 
                ease: 'power1',
                transformOrigin:'50% 50%'
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
}