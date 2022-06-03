import gsap from 'gsap'
import * as THREE from 'three'

import Experience from '../Experience'

export default class UIAnimation {
    constructor() {
        this.experience = new Experience()
        
        // Defaults
        this.closeBtn = document.querySelector('.close_btn')

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
        })
        closeAnimation.to('.close_btn svg', {
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.in'
        }, '<')
        closeAnimation.to('.close_btn svg rect', {
            rotate: '+=90deg',
            transformOrigin: '50% 50%'
        }, '<')

        // Events
        this.closeBtn.addEventListener('mouseenter', () =>{
            closeAnimation.timeScale(2).play()
        })
        this.closeBtn.addEventListener('mouseleave', () =>{
            closeAnimation.reverse()
        })

        // Create UI animation
        this.showMenu()
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

        this.menuAimation = gsap.timeline({ paused: true })
        this.menuAimation.to('.menu', {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: '-0',
            ease: 'power2',
            duration: 1
        })
        this.menuAimation.to('.menu__item', {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power1',
            stagger: 0.2
        }, '<+=80%')
        this.menuAimation.to('.menu__item span', {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power1',
            stagger: 0.2
        }, '<+=60%')
    }
}