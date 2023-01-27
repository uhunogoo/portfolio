
import '../../assets/CloseButton.css'
import gsap from 'gsap'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'

export default function CloseButton( {click, ...props} ) {
    const closeButton = useRef()
    const audio = useMemo(() => (
        new Audio( '/audio/close-sound.mp3' )
    ), [])

    const [ctx, setCtx] = useState( gsap.context(() => {}) )
    const q = gsap.utils.selector( closeButton )
  
    useLayoutEffect( () => {
        ctx.add('closeButtonRotate', () => {
            const tl = gsap.timeline({ paused: true })
            tl.to(q('.close_btn g'), { 
                rotate: gsap.utils.wrap([0, 0]),
                duration: 0.4,
                ease: 'power1'
            })

            return tl
        })
        ctx.add('closeButtonHover', () => {
            const tl = gsap.timeline({ paused: true })
            tl.to(q('.close_btn g'), { 
                rotate: gsap.utils.wrap([-45, 45]),
                duration: 0.4,
                ease: 'power1'
            })

            return tl
        })
        ctx.add('buttonAnimation', () => {
            const tl = gsap.timeline()
            tl.to( closeButton.current, {
                opacity: 1,
                scale: 1
            }, 0.4)
            tl.add( ctx.closeButtonRotate().play(), '<+=30%') 
            return tl
        } )
        ctx.add('buttonOut', () => {
            const tl = gsap.to( closeButton.current, {
                opacity: 0,
                scale: 0,
                overwrite: true,
                onStart: () => audio.play(0)
            })
            return tl
        } )
        ctx.add( () => {
            gsap.set(q('.close_btn g'), { 
                rotate: gsap.utils.wrap([-45, 45]), 
                transformOrigin: '50% 50%' 
            })
            gsap.set(closeButton.current, { scale: 0, opacity: 0 })
            
            ctx.buttonAnimation().play() 
        } )

    }, [] )

    return <>
        <div ref={ closeButton } {...props} className="close_btn" title="close" role="button" 
            onMouseEnter={ () => ctx.closeButtonHover().restart() }
            onMouseLeave={ () => ctx.closeButtonRotate().restart() }
            onClick={ () => {
                ctx.buttonOut().restart()
                click()
            } }
        >
            <svg viewBox="0 0 800 800">
                <g id="first">
                    <line className="st0" x2="525" y2="525" x1="759.2" y1="759.2"/>
                    <line className="st0" x1="40.8" y1="40.8" x2="275" y2="275"/>
                </g>
                <rect id="square" x="332.1" y="332.1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -165.6854 400)" width="135.8" height="135.8"/>
                <g id="second">
                    <line className="st0" x2="525" y2="275" x1="759.2" y1="40.8"/>
                    <line className="st0" x1="40.8" y1="759.2" x2="275" y2="525"/>
                </g>
            </svg>
        </div>
    </>
}