import '../assets/ModalPage.css'
import gsap from 'gsap'

import { useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMenuButtonState, toggleMenuState, resetMenuState } from '../menuButtonSlice.js'
import { resetTarget } from '../CameraSlice.js'

import MyWorks from '../Components/MyWorks.jsx'
import AboutMe from '../Components/AboutMe.jsx'
import CloseButton from './Buttons/CloseButton.jsx'

const ContentBlock = ({ reversed }) => {
    const dispatch = useDispatch()
    const menu = useSelector( getMenuButtonState )
    
    const tl = useMemo( () => gsap.timeline({ paused: true }), [])
    const addAnimation = useCallback((animation, index = 0) => {  
        tl && tl.add(animation.play(), index)
    }, [tl])
    useLayoutEffect(() => {
        if ( tl && tl.duration() !== 0 ) {
            const timeScale = reversed ? 1.8 : 1.5
            const delay = reversed ? 0 : 0.75
            
            gsap.delayedCall(delay, () => {
                tl.play().timeScale(timeScale).reversed(reversed)
                tl.eventCallback('onReverseComplete', () => {
                    dispatch( resetMenuState() )
                })
            })
        }
    }, [reversed, tl])
    
    return <>
        { (menu === 'myWorks') ? <MyWorks addAnimation={ addAnimation } /> : null }
        { (menu === 'aboutMe') ? <AboutMe addAnimation={ addAnimation } /> : null }
    </>
}

export default function ModalPage() {
    const dispatch = useDispatch()
    const content = useRef()

    const [reversed, setReversed] = useState( () => false )

    return <>
        <div ref={ content } className="point__content">
            <CloseButton click={ () => {
                setReversed(state => true)
                dispatch( toggleMenuState() )
                dispatch( resetTarget() )
            } } />
            <ContentBlock reversed={ reversed } />
		</div>
    </>
}