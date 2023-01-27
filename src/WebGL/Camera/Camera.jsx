import gsap from 'gsap'

import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { Mouse, useCameraEffect } from './MouseHook.jsx'

import { useSelector } from 'react-redux'
import { getCameraPoints } from '../../CameraSlice.js'
import { getEnterState } from '../../enterButtonSlice.js'
import { getMenuState, getMenuButtonState } from '../../menuButtonSlice.js'

const cameraSettings = {
    fov: 55,
    near: 0.1,
    zoom: 0.75,
    far: 100,
}

const EnterAnimation = () => {
    const enterButtonState = useSelector(getEnterState)
    // const enterState = useSelector(getEnterButtonState)
    const camera = useThree( state => state.camera )
    const [ ctx ] = useState( state => gsap.context(() => { }) )
    useLayoutEffect(() => {
        ctx.add('intro',() => {
            const tl = gsap.timeline()
            tl.fromTo(camera, { zoom: 0.5, fov: 80 }, { 
                zoom: cameraSettings.zoom, 
                fov: cameraSettings.fov, 
                duration: 2, 
                delay: 0.7,
                ease: 'back.out(2)' 
            })

            return tl
        })
        ctx.add(() => {
            gsap.set(camera, { zoom: 0.5, fov: 80 })
        })

        return () => ctx.revert()
    }, [camera])
    useLayoutEffect(() => {
        if( !enterButtonState ) {
            ctx.intro()
        }
    }, [enterButtonState])
}

const AnimateCamera = ({ children }) => {
    const cameraTargets = useSelector(getCameraPoints)
    const menuState = useSelector(getMenuButtonState)
	const menu = useSelector( getMenuState )
    
    const audio = useMemo(() => (
        new Audio( '/audio/open-sound.mp3' )
    ), [])
    const tl = useMemo( () => gsap.timeline({ paused: true }), [])
    const [ ctx ] = useState( state => gsap.context(() => { }) )

    const cameraEffect = useCameraEffect()
    const startEnterAnimation = EnterAnimation()
    
    useLayoutEffect(() => {
        return () => ctx.revert()
    }, [])
    useLayoutEffect(() => {
        ctx.add('move', (target) => {
            return gsap.effects['cameraAnimation'](target)
        })
    }, [ cameraEffect ])


    const addAnimation = useCallback((animation, index = 0) => {  
        tl && tl.add(animation.play(), index)
    }, [tl])

    
    useLayoutEffect(() => {
        ctx.add(() => {
            if ( tl ) {
                if (tl.getChildren().length === 0) {
                    if (menuState === 'myWorks') {
                        addAnimation( ctx.move(cameraTargets[1]) )
                    } else if (menuState === 'aboutMe') {
                        addAnimation( ctx.move(cameraTargets[0]) )
                    }
                }
                
                if ( tl.duration() !== 0 ) {
                    const delay = !menu ? 0.5 : 0
                    gsap.delayedCall(delay, () => {
                        tl.play().timeScale(1.2).reversed( !menu ) 
                        tl.eventCallback('onStart', () => gsap.delayedCall(0.23, () => audio.play(0)) )
                        tl.eventCallback('onReverseComplete', () => tl.clear() )
                    })
                }
            }
        })
    }, [ menu ])

    return <>
        { children }
    </>
}

export default function Camera({ mouse }) {
    return <>
        <Mouse mouse={ mouse } />
        <AnimateCamera>
            <PerspectiveCamera {...cameraSettings} makeDefault />
        </AnimateCamera>
        {/* <OrbitControls makeDefault /> */}
    </>
}
