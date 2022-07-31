import gsap from 'gsap'
import * as THREE from 'three'

import Experience from '../Experience'

export default class UIAnimation {
    constructor() {
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        

        // Defaults
        this.closeBtn = document.querySelector('.close_btn')
        this.enterButton = document.querySelector('.preload__enter')
        gsap.set('.title-decor div', { transformPerspective: '2000' })

        
        // Animations
        const closeAnimation = gsap.timeline({
            paused: true,
        })
        closeAnimation.to('.close_btn svg line', {
            duration: 0.8,
            keyframes: {
                '50%': {
                    strokeDashoffset: 400,
                    ease: 'power1.in'
                },
                '100%': {
                    strokeDashoffset: 800,
                    ease: 'power4'
                },
            }
        }, 0)
        closeAnimation.to('.close_btn svg', {
            scale: 0.6,
            duration: 0.6,
            ease: 'power4.in'
        }, '<')
        closeAnimation.to('.close_btn svg rect', {
            rotate: '+=90deg',
            transformOrigin: '50% 50%'
        }, '<')
        const enterAnimation = gsap.timeline({
            paused: true,
        })
        enterAnimation.to(this.enterButton, {
            scale: 1.1,
            ease: 'power1'
        })

        // Events
        this.iteractive = null
        document.addEventListener('mousemove', e => {
            const target = e.target
            if ( target === this.enterButton && !this.iteractive ) {
                // Set iteractive 
                this.iteractive = 'enter'

                const buttonIsActive = target.classList.contains( 'active' )
                if (buttonIsActive) return

                enterAnimation.timeScale(2).play()
            } else if ( target !== this.enterButton && this.iteractive === 'enter' ) {
                // Set iteractive 
                this.iteractive = null

                const buttonIsActive = target.classList.contains( 'active' )
                if (buttonIsActive) return

                enterAnimation.reverse()
            }

            if ( target === this.closeBtn && !this.iteractive ) {
                // Set teractive 
                this.iteractive = 'close'

                const buttonIsActive = this.closeBtn.classList.contains( 'active' )
                if (buttonIsActive) return
                
                closeAnimation.timeScale(2).play()
            } else if ( target !== this.closeBtn && this.iteractive === 'close' ) {
                // Set iteractive 
                this.iteractive = null
                
                const buttonIsActive = this.closeBtn.classList.contains( 'active' )
                if (buttonIsActive) return
                
                closeAnimation.reverse()
            }
            
            
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
    update() {
        gsap.to('.title-decor div', {
            rotationY: -10 * this.mouse.x,
            rotationX: -10 * this.mouse.y,
            duration: 0.2, 
            ease: 'power1',
            transformOrigin:'50% 50%'
        })        
    }
}