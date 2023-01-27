import gsap from 'gsap'
import { useDispatch } from 'react-redux'
import { useRef, useLayoutEffect, useMemo, useCallback } from 'react'
import { setTarget } from '../CameraSlice.js'
import { toggleAboutMe, toggleMenuState, toggleMyWork } from '../menuButtonSlice.js'
import MenuButton from './Buttons/MenuButton.jsx'

export default function Menu({ addAnimation }) {
    const dispatch = useDispatch()
    const menu = useRef()
    const buttons = useMemo(() => [
		{
			class: 'menu__item menu__item_about',
			src: '/backgrounds/about.svg',
			text: 'About me',
			title: 'about me',
			function: () => {
				dispatch( toggleAboutMe() )
				dispatch( toggleMenuState() )
			}
		},
		{
			class: 'menu__item menu__item_works',
			src: '/backgrounds/works.svg',
			text: 'Works',
			title: 'my works',
			function: () => {
				dispatch( toggleMyWork() )
				dispatch( toggleMenuState() )
			}
		}
	])
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(menu.current, { opacity: 0, scale: 1.5, x: -100, y: 100, rotate: '-90deg' })
        })

        return () => ctx.revert()
    }, [])    
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const menuAnimation = gsap.to(menu.current, {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotate: '0',
                ease: 'power2',
                duration: 1
            })

            // Add animation to global timeline
            addAnimation(menuAnimation, 0)
        }, menu)

        return () => ctx.revert()
    }, [addAnimation])

    const addChildAnimation = useCallback((animation, index) => {
        addAnimation && addAnimation( animation, index )
    }, [addAnimation]) 

    return (
        <nav ref={ menu } className="menu">
            { buttons.map( (button, i) => {
                const key = Date.now() + i

                return (
                    <MenuButton 
                        key={ key } 
                        index={i}
                        clickAction={ () => dispatch( setTarget(i) ) } 
                        addButtonAnimation={ addChildAnimation } 
                        buttonData={ button } 
                    />
                )
            }) }
        </nav>
    )
}