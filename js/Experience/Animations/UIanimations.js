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
        this.worksContainer = document.querySelector('.works')
        this.maxScroll = ScrollTrigger.maxScroll(this.worksContainer) - 1

        this.scroll()
        
        gsap.to('.works img', {
            repeat: -1,
            ease: 'none',
            x: "+=" + 1000,
            duration: 10,
            modifiers: {
              x: gsap.utils.wrap(-1000, 1000)
            }
        })
    }
    scroll() {
        const sections = gsap.utils.toArray('.works .work')
        const firstBlock = sections[ 0 ]
        const lastBlockLeft = sections[ sections.length - 1]
        const scrollX = () => {
            const firstBlockX = firstBlock.getBoundingClientRect().x
            return (lastBlockLeft.offsetLeft + lastBlockLeft.clientWidth + firstBlockX)
        }
        const scrollY = () => {
            const firstBlockX = firstBlock.getBoundingClientRect().x
            const widthProportion = (lastBlockLeft.offsetLeft + lastBlockLeft.clientWidth + firstBlockX) / this.sizes.width
            const percentageValue = widthProportion * 100
            return `+=${ percentageValue * 0.72 }%`
        }

        const sliderItems = sections
        const numSlides = sliderItems.length

        // slides positions
        for (let i = 0; i < numSlides; i++) {
            gsap.set(sliderItems[i], { xPercent: i * 100, y: 0 })
        }
        
        const tween = gsap.to(sliderItems, {
            xPercent: "-=" + (numSlides * 100),
            ease: "none",
            onUpdate: () => {
                sliderItems.forEach( slide => {
                    const positonX = gsap.getProperty(slide, 'xPercent')
                    const x = (positonX / 100) * slide.clientWidth
                    const s = 1 - x / this.sizes.width
                    console.log( s )
                    
                    const image = slide.querySelector('img')
                    
                    gsap.set( image, { objectPosition: s * 100 + '% 50%' })
                    // return scale
                })
                // gsap.to('.works .work img', {
                //     scale: ( index, target, targets ) => {
                //     }
                // })
            },
            modifiers: {
                xPercent: gsap.utils.wrap(-100, (numSlides - 1) * 100)
            }
        })
        const scrollTriggerAnimation = ScrollTrigger.create({
            animation: tween,
            invalidateOnRefresh: true,
            scroller: '.works',
            trigger: ".works__wrap",
            pin: true,
            scrub: 1.1,
            end: scrollY
        })
        // let scrollTween = gsap.to(sections, {
        //     xPercent: "-=" + (numSlides * 100),
        //     modifiers: {
        //         xPercent: gsap.utils.wrap(-100, (numSlides - 1) * 100)
        //     },
        //     ease: "none", // <-- IMPORTANT!
        //     scrollTrigger: {
        //         invalidateOnRefresh: true,
        //         scroller: '.works',
        //         trigger: ".works__wrap",
        //         pin: true,
        //         scrub: 1.1,
        //         end: scrollY
        //     }
        // })
        
        // sections.forEach( section => {
        //     gsap.fromTo( section.querySelector('img'), { objectPosition: '80% 50%', },{ 
        //         objectPosition: '20% 50%',
        //         ease: "none", // <-- IMPORTANT!
        //         scrollTrigger: {
        //             trigger: section,
        //             containerAnimation: scrollTween,
        //             scrub: 0.1,
        //             start: "0% 100%",
        //             end: "100% 0%",
        //             markers: true
        //         }
        //     })
        // })
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