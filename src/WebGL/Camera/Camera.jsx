import gsap from 'gsap'

import { PerspectiveCamera } from '@react-three/drei'
import { useState, useLayoutEffect, useCallback, useMemo, useRef } from 'react'

import { useSelector } from 'react-redux'
import { getCameraPoints } from '../../CameraSlice.js'
import { getEnterState } from '../../enterButtonSlice.js'
import { getMenuState, getMenuButtonState } from '../../menuButtonSlice.js'
import { useCameraMove, useCameraEffect } from '../../utils/useCameraMove.jsx'

const cameraSettings = {
    fov: 55,
    near: 0.1,
    zoom: 0.75,
    far: 100,
}

export default function Camera() {
    return <>
        <CameraMotion>
            <PathAnimation />
        </CameraMotion>
    </>
}

function CameraMotion({ children }) {
    useCameraMove();

    return <>
        { children }
    </>;
}

function PathAnimation() {
    const camera = useRef( null );
    const cameraTargets = useSelector(getCameraPoints)
    const menuState = useSelector(getMenuButtonState)
	const menu = useSelector( getMenuState )
    
    const audio = useMemo(() => (
        new Audio( '/audio/open-sound.mp3' )
    ), [])

    const tl = useMemo( () => gsap.timeline({ paused: true }), [])
    const [ ctx ] = useState( gsap.context(() => { }) )

    const cameraEffect = useCameraEffect()
    useEnterAnimation( camera );
    
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
        <PerspectiveCamera ref={ camera } {...cameraSettings} makeDefault />
    </>
}

function useEnterAnimation( camera ) {
    const enterButtonState = useSelector(getEnterState);
    const [ ctx ] = useState( gsap.context(() => { }) );
    const [ notPlayed, setNotPlayed ] = useState( true );
    
    useLayoutEffect(() => {
        ctx.add('intro',() => {
            const tl = gsap.timeline({
                onComplete: () => setNotPlayed( false ) 
            });
            tl.to(camera.current, { 
                zoom: cameraSettings.zoom, 
                fov: cameraSettings.fov, 
                duration: 2, 
                delay: 0.7,
                ease: 'back.out(2)' 
            });

            return tl;
        });
        ctx.add(() => {
            notPlayed && gsap.set(camera.current, { zoom: 0.5, fov: 80 });
        });

        // Cleanup
        return () => ctx.revert();
    }, [ camera ])

    // Play enter animation
    useLayoutEffect(() => {
        if( !notPlayed || enterButtonState ) return ;
        ctx.intro();
    }, [ enterButtonState, notPlayed ]);

    return notPlayed;
}