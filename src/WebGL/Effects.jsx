import gsap from 'gsap'

import { LinearFilter } from 'three'
import { BlendFunction } from 'postprocessing'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { useControls } from 'leva'
import { useSelector } from 'react-redux'
import { getMenuState } from '../menuButtonSlice.js'

const EfectsWrapper = ({ children }) => {
    const composer = useRef(null)
    const effecttComposerSettings = useControls('Effect Composer settings',{
        enabled: true,
    })
    
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
            // frameBufferType={ THREE.HalfFloatType }
            { ...effecttComposerSettings }
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
    const bloomSettings = useControls('Bloom settings',{
        intensity: { value: .35, min: 0, max: 2, step: 0.001 },
        radius: { value: 1, min: 0, max: 2, step: 0.001 },
        levels: { value: 2, min: 0, max: 2, step: 0.001 },
        luminanceThreshold: { value: 0, min: 0, max: 2, step: 0.001 },
        luminanceSmoothing: { value: 0.17, min: 0, max: 1, step: 0.001 },
    })
	
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