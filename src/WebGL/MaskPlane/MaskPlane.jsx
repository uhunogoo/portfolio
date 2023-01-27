
import gsap from 'gsap'
import { useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import MaskMaterial from './Materials/MaskMaterial.jsx'
// Redux
import { useSelector } from 'react-redux'
import { getEnterState } from '../../enterButtonSlice.js'
import { getMenuState } from '../../menuButtonSlice.js'

export function MaskPlane({ children, tl }) {
    const enter = useSelector( getEnterState )
	const menu = useSelector( getMenuState )
    
    useLayoutEffect(() => {
        const showMask = menu || enter

        const delay = showMask ? 0.5 : 0.15
        gsap.delayedCall(delay, () => {
            tl && tl.play().timeScale(0.8).reversed(showMask) 
        })
	}, [tl, menu, enter])

    return <>
        { children } 
    </>
}

export default function AnimatedMaskPlane() {
    const tl = useMemo( () => gsap.timeline({ paused: true }) )
    const mask = useRef()
	
    const addAnimation = useCallback(( animation, index = 0) => {
		tl && tl.add( animation, index )   
	}, [tl])
	
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const animation = gsap.to(mask.current.material.uniforms.uProgress, {
                value: 0,
                duration: 1,
                ease: 'power1.in'
            }, 0)

            addAnimation( animation )
        })

        return () => ctx.revert()
    }, [])
    return <>
        <MaskPlane tl={tl}>
            <mesh ref={ mask }>
                <planeGeometry args={[2, 2, 250, 250]}/>
                <MaskMaterial transparent={ true } />
            </mesh>
        </MaskPlane>
    </>
}