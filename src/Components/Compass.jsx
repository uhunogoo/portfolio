import '../assets/Compass.css'
import gsap from 'gsap'
import { useLayoutEffect, useRef, useState } from 'react'
import { useMousePosition } from '../utils/useMouse'

const CompassDots = ({ children }) => {
    const mouse = useMousePosition()
    const [ctx] = useState( gsap.context(() => {}) )

    useLayoutEffect(() => {
		gsap.set('.compass__dots', { xPercent: -50, yPercent: -50 })

        ctx.add('moveX', ( x ) => {
            const moveX = gsap.quickTo('.compass__dots', 'x', {
                ease: 'power1',
                duration: 0.7,
            })
            
            return moveX( x )
        })
        return () => ctx.revert()
    }, [])
    useLayoutEffect(() => {
        ctx.moveX( - mouse.x * 20 )
    }, [ mouse ])
    return <>
        { children }
    </>
}
export default function Compass({ addAnimation }) {
    const compass = useRef()
    
    useLayoutEffect(() => {
		gsap.set(compass.current, { y: -50, opacity: 0 })
    }, [])
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const compassAnimation = gsap.fromTo(compass.current, {
                y: -50, 
                opacity: 0
            },{
                opacity: 1,
                y: 0,
                ease: 'power1',
                duration: 0.75
            })

            // Add animation to global timeline
            addAnimation(compassAnimation, 0.25)
        })

        return () => ctx.revert()
    }, [addAnimation])

    return <>
        <div ref={ compass } className="compass">
            <img  width="620" height="37" src="/backgrounds/compass.svg" alt="compass" />
            <CompassDots>
                <div className="compass__dots">
                    <img  width="434" height="6" src="/backgrounds/compass-dots.png" alt="dots" />
                </div>
            </CompassDots>
        </div>
    </>
} 