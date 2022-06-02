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
    }
}