import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

export default function MenuButton({ index, buttonData, addButtonAnimation, clickAction }) {
    const button = useRef()
    
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const buttonAnimation = gsap.fromTo(button.current, {
                opacity: 0, scale: 0.2
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power1'
            }, 0.3)
            const textAnimation = gsap.fromTo('.menu__item span', {
                opacity: 0, y: 30, scale: 0.6
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: 'power1',
                overwrite: true
            })

            // Add animation to global timeline
            addButtonAnimation(buttonAnimation, 0.3 + index / 10)
            addButtonAnimation(textAnimation, 0.35 + index / 10)
        }, button)

        return () => ctx.revert()
    }, [addButtonAnimation, index])

    return <>
        <div
            ref={button}
            className={buttonData.class}
            title={buttonData.title}
            role="button"
            onClick={() => {
                clickAction()
                // Button action
                buttonData.function()
            }}
        >
            <div className="menu__icon">
                <img  width="50" height="50" src={buttonData.src} alt={buttonData.text} />
            </div>
            <span>{buttonData.text}</span>
        </div>
    </>
} 