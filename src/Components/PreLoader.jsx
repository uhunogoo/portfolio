import '../assets/Preload.css'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux';
import { getProgress, getProgressStatus, setEnterState, toggleEnterState } from '../enterButtonSlice'
import { useLayoutEffect, useRef, useState } from 'react'
import { useMemo } from 'react'

const TitleDecor = () => {
    return <>
        <div className="preload__decor">
            <div className="preload__disc"></div>
        </div>
    </>
}
const value = { progress: 0 }
export default function PreLoader() {
    const dispatch = useDispatch()
    const progress = useSelector( getProgress )
    const progressStatus = useSelector( getProgressStatus )
    
    const preloader = useRef( null )
    const preloadTitle = useRef( null )
    const progressBlock = useRef( null )
    const progressBar = useRef( null )
    const enterButton = useRef( null )

    const audio = useMemo(() => (
        new Audio( '/audio/enter-sound.mp3' )
    ), [])
    const [tl, setTl] = useState( gsap.timeline({paused: true}) )
    const [ctx, setCtx] = useState( gsap.context(() => {}) )
    const q = gsap.utils.selector(preloader)

    useLayoutEffect(() => {
        ctx.add('enterButtonAnimation', () => {
            const textAnimation = gsap.to(q('.preload__enter span'), {
                keyframes: {
                    '50%': { color: '#F3B754', ease: 'power1.out' },
                    '100%': { color: '#121F2F', ease: 'power1.in' },
                },
                immediateRender: true,
                overwrite: true,
                duration: 0.4,
                stagger: 0.05
            }, '>')
            return textAnimation
        })
        ctx.add('inAnimation', (delay = 0) => {
            const tl = gsap.timeline({ delay: delay, defaults: { ease: 'none' } })
            tl.to(progressBlock.current, {
                y: -20,
                scale: 0.3,
                opacity: 0,
                ease: 'power1.out',
                transformOrigin: 'center center'
            }) 
            tl.fromTo(enterButton.current, {
                autoAlpha: 0,
                y: 40,
                scale: 2,
            }, {
                y: 0,
                autoAlpha: 1,
                scale: 1,
            }, 0.25)
            tl.add( ctx.enterButtonAnimation() )
        })
        ctx.add('remove', () => {
            const tl = gsap.timeline({
                defaults: {
                    overwrite: true,
                    immediateRender: true,
                    duration: 1,
                    ease: 'power1.out',
                },
                // repeat: -1,
                onStart: () => {
                    audio.play(0)
                    dispatch( setEnterState() )
                },
                onComplete: () => dispatch( toggleEnterState() )
            })
            tl.to(enterButton.current, {
                opacity: 0,
                scale: 0.3,
                duration: 0.6
            })
            tl.to(q('.preload__line'), {
                transformOrigin: 'center center',
                yPercent: gsap.utils.wrap([100, -100]),
                ease: 'power2'
            }, 0.12)
            tl.to(q('.preload__titleContainer span'), {
                transformOrigin: 'center center',
                opacity: 0,
                yPercent: gsap.utils.wrap([-100,100]),
                ease: 'power4',
                duration: 0.6
            }, 0.12)
            tl.to(q('.preload__title'), {
                opacity: 0,
                ease: 'power3'
            }, '<+=30%')
            tl.to(q('.preload__decor'), {
                rotate: '-180deg',
                scale: 2,
                opacity: 0,
                duration: 1.3,
                ease: 'power1.inOut'
            }, '<')
            return tl
        })

        ctx.add('progress', () => {
            const tl = gsap.timeline()
            tl.from(progressBar.current, {
                scaleX: 0,
                transformOrigin: 'left center'
            })
            return tl
        })
        ctx.add(() => {
            gsap.set( q('.preload__disc'), { transformPerspective: '2000' })

            gsap.to(q('.preload__decor'), {
                rotate: '0',
                immediateRender: true,
                scale: 0.85,
                opacity: 0.025,
                duration: 2
            })
            tl.add( ctx.progress(), 0)

            // ctx.inAnimation()
        })
        
        // Cleanup
        return () => ctx.revert()
    }, [])

    useLayoutEffect(() => {
        gsap.fromTo(value, { progress: value.progress }, {
            progress: progress,
            duration: 0.03,
            ease: 'power1',
            onUpdate: () => {
                tl && tl.progress( value.progress )
            }
        })
    }, [progress])
    useLayoutEffect(() => {
        if(progressStatus) {
            ctx.inAnimation(0.3)
        }
    }, [progressStatus])
    return <>
        <div ref={ preloader } className="preload">
            <div className="preload__content">
                <TitleDecor />
                <h1 ref={ preloadTitle } className="preload__title">
                    <span className="preload__line preload__line_top"></span>
                    <div className="preload__titleContainer">
                        <span>
                            Yurii Scherbachenko
                        </span>
                        <span>
                            Frontend developer
                        </span>
                    </div>
                    <span className="preload__line preload__line_bottom"></span>
                </h1>
            </div>
            <div ref={ progressBlock } className="preload__progress">
                <svg x="0" y="0" viewBox="0 0 699 59">
                    <g>
                        <path className="st0" d="M21.7,49.9l8.5-8.4l6.5,6.4l-3.8,3.7l-1.4-1.5l2.3-2.3l-3.6-3.5l-5.6,5.5l7,7h14.7V59H30.8L21.7,49.9z M7.6,36
                            l6.5-6.5L7.6,23l10.5-10.4l8.5,8.4l-6.5,6.4l-3-3V21h2v2.6l1,1l3.6-3.5l-5.6-5.5L10.5,23l5.3,5.3l1.2,1.2L10.5,36l7.6,7.5l5.6-5.5
                            l-3.6-3.5l-1,1V38h-2v-3.4l3-3l6.5,6.4l-8.5,8.4L7.6,36z M21.7,9l9.1-9l15.5,0v2.1H31.6l-7,7l5.6,5.5l3.6-3.5l-2.3-2.3l1.4-1.5
                            l3.8,3.7l-6.5,6.4L21.7,9z"/>
                        <path className="st0" d="M45.7,16.1v26.8L31.2,29.5L45.7,16.1z"/>
                        <polygon className="st0" points="8.9,29.5 4.5,34 0,29.5 4.5,25 	"/>
                    </g>
                    <g>
                        <path className="st0" d="M668.2,59h-15.5v-2.1h14.7l7-7l-5.6-5.5l-3.6,3.5l2.3,2.3l-1.4,1.5l-3.8-3.7l6.5-6.4l8.5,8.4L668.2,59z
                            M680.9,46.4l-8.5-8.4l6.5-6.4l3,3V38h-2v-2.6l-1-1l-3.6,3.5l5.6,5.5l7.6-7.5l-6.5-6.5l1.2-1.2l5.3-5.3l-7.6-7.5l-5.6,5.5l3.6,3.5
                            l1-1V21h2v3.4l-3,3l-6.5-6.4l8.5-8.4L691.4,23l-6.5,6.5l6.5,6.5L680.9,46.4z M668.8,17.5l-6.5-6.4l3.8-3.7l1.4,1.5l-2.3,2.3
                            l3.6,3.5l5.6-5.5l-7-7h-14.7V0h15.5l9.1,9L668.8,17.5z"/>
                        <path className="st0" d="M667.8,29.5l-14.8,13.7V15.7L667.8,29.5z"/>
                        <polygon className="st0" points="694.5,25 699,29.5 694.5,34 690.1,29.5 	"/>
                    </g>
                    <rect x="44.7" y="1" className="st1" width="609.3" height="57"/>
                    <rect ref={ progressBar } x="55" y="10" className="progress__bar st2" width="588.7" height="39"/>
                    <g id="points">
                        <polygon className="st3" points="505.3,10.4 505.3,9.3 497,9.3 496,9.3 487.7,9.3 487.7,10.4 496,10.4 496,48.6 487.7,48.6 487.7,49.7 
                            496,49.7 497,49.7 505.3,49.7 505.3,48.6 497,48.6 497,10.4 	"/>
                        <polygon className="st3" points="644.2,49.7 634.9,49.7 634.9,48.6 643.2,48.6 643.2,10.4 634.9,10.4 634.9,9.3 644.2,9.3 	"/>
                        <polygon className="st3" points="63.8,49.7 54.4,49.7 54.4,9.3 63.8,9.3 63.8,10.4 55.4,10.4 55.4,48.6 63.8,48.6 			"/>
                        <polygon className="st3" points="210.9,10.4 210.9,9.3 202.6,9.3 201.6,9.3 193.3,9.3 193.3,10.4 201.6,10.4 201.6,48.6 193.3,48.6 
                            193.3,49.7 201.6,49.7 202.6,49.7 210.9,49.7 210.9,48.6 202.6,48.6 202.6,10.4 	"/>
                        <polygon className="st3" points="358.1,10.4 358.1,9.3 349.8,9.3 348.8,9.3 340.5,9.3 340.5,10.4 348.8,10.4 348.8,48.6 340.5,48.6 
                            340.5,49.7 348.8,49.7 349.8,49.7 358.1,49.7 358.1,48.6 349.8,48.6 349.8,10.4 	"/>
                    </g>
                </svg>
            </div>
            <button 
                ref={ enterButton } 
                className="preload__enter" 
                title="enter"
                onMouseEnter={ () => ctx.enterButtonAnimation().restart() }
                onClick={ () => ctx.remove().timeScale(2) }
            >
                <span>e</span><span>n</span><span>t</span><span>e</span><span>r</span>
            </button>
        </div>
    </>
} 