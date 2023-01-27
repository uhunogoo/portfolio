import '../assets/UI.css'
import gsap from 'gsap'

import { useLayoutEffect, useRef, useMemo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { getMenuButtonState } from '../menuButtonSlice.js'

import Compass from './Compass.jsx'
import Menu from './Menu'

const Layer = ({ tl, children }) => {
	const menu = useSelector( getMenuButtonState )
	const uiLayer = useRef()

	const reversed = menu !== 'default'
    const [firstPlay, setFirstPlay] = useState( false )
	
    useLayoutEffect(() => {
		const delay = firstPlay ? 0 : 0.5

		gsap.delayedCall(delay, () => {
			tl && tl.play().timeScale( 1.2 ).reversed( reversed )
			
			if ( !firstPlay ) setFirstPlay( true )
		})
    }, [menu, tl])

	return <>
		<div ref={ uiLayer } className="ui-layer">
			{ children }
		</div>
	</>
}

export default function UI() {
    const tl = useMemo(() => gsap.timeline() )
  
	const addAnimation = useCallback(( animation, index = 0 ) => {
		if ( tl ) {
			tl.add( animation, index )
		}
	}, [tl])
	
    return <>
		<Layer tl={ tl }>
			<Compass addAnimation={ addAnimation } />
			<Menu addAnimation={ addAnimation } />
		</Layer>
    </>
}
