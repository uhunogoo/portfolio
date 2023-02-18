import gsap from 'gsap'

import { LinearFilter } from 'three'
import { BlendFunction } from 'postprocessing'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { useSelector } from 'react-redux'
import { getMenuState } from '../menuButtonSlice.js'

const EfectsWrapper = ({ children }) => {
    const composer = useRef(null)
    
    useEffect(() => {
        const target = composer.current
        
        target.inputBuffer.texture.minFilter = LinearFilter
        target.inputBuffer.texture.magFilter = LinearFilter
        target.outputBuffer.texture.minFilter = LinearFilter
        target.outputBuffer.texture.magFilter = LinearFilter
    }, [])

    return <>
        <EffectComposer 
            ref={composer}
            multisampling={3} 
            disableNormalPass={ true }
        >
            { children }
        </EffectComposer>
    </>
}

const AnimatedBloom = ({target, children}) => {
	const menu = useSelector( getMenuState )
    
    useLayoutEffect(() => {
        const showMask = !menu

        const delay = showMask ? 0.5 : 0
        gsap.delayedCall(delay, () => {
            target && target.play().timeScale(0.8).reversed(showMask) 
        })

	}, [target, menu])

    return <>
        { children }
    </>
}

export default function EffectsLayout({ camera }) {
    const bloomSettings = {
        intensity: .35,
        radius: 1,
        levels: 2,
        luminanceThreshold: 0,
        luminanceSmoothing: 0.17,
    }
	
    const bloom = useRef(null)
    const tl = useMemo( () => gsap.timeline({ paused: true }) )
    const addAnimation = useCallback(( animation, index = 0) => {
		tl && tl.add( animation, index )   
	}, [tl])
	
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const animation = gsap.to(bloom.current, {
                intensity: 2,
                duration: 1,
                ease: 'power1.in'
            }, 0)

            addAnimation( animation )
        })

        return () => ctx.revert()
    }, [])
    return <>
        <EfectsWrapper>
            <Vignette
                offset={ 0.3 }
                eskil={ false }
                darkness={ 0.9 }
                blendFunction={ BlendFunction.NORMAL }
            />
            <AnimatedBloom target={ tl }>
                <Bloom 
                    ref={ bloom }
                    mipmapBlur
                    {...bloomSettings}
                />
            </AnimatedBloom>
        </EfectsWrapper>
    </>
}