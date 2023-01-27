import '../assets/MyWorks.css'

import gsap from 'gsap'
import { useState, useLayoutEffect, useRef, useMemo } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )
gsap.core.globals( 'ScrollTrigger', ScrollTrigger )

const ProjectBlock = ({ id, animation, ...props }) => {
    const section = useRef( null )
    const [ ctx, setCtx ] = useState( gsap.context(() => {}) )
    useLayoutEffect(() => {
        ctx.add(() => {
            gsap.set(section.current, { x: id * 100 + '%',  })
        })

        return () => ctx.revert()
    }, [])
    useLayoutEffect(() => {
        ctx.add(() => {
            if (animation) {
                const animation1 = gsap.fromTo('.work__image picture', 
                    { y: '25%', scale: 0.5, rotate: '15deg' },
                    { y: '-25%', rotate: '-15deg', scale: 1.5, ease: 'none' }
                )
                const animation2 = gsap.fromTo('.work__image', 
                    { x: '-50%' },
                    { x: '-120%', ease: 'none' }
                )
                ScrollTrigger.create ({
                    animation: animation1, 
                    trigger: section.current,
                    containerAnimation: animation,
                    invalidateOnRefresh: true,
                    scrub: 0.01,
                    start: '0% 100%',
                    end: '100% 0'
                })
                ScrollTrigger.create ({
                    animation: animation2, 
                    trigger: section.current,
                    containerAnimation: animation,
                    invalidateOnRefresh: true,
                    scrub: 0.01,
                    start: '0% 13%',
                    end: '100% 0'
                })

                ScrollTrigger.sort()
                ScrollTrigger.refresh()
            }
        }, section.current)
    }, [animation])

    return <>
        <div ref={ section } className="work">
            <a className="work__link work__image" href={ props.link } target="_blank" rel="nofollow noopener">
                <picture>
                    <source srcSet={ props.images.src[0] } />
                    <img  width="1323" height="785" src={ props.images.src[1] } alt={ props.images.alt } />
                </picture>
            </a>
        </div>
    </>
}

export default function MyWorks({ addAnimation }) {
    const works = useRef()
    const worksScroller = useRef()
    const myWorks = useMemo(() => [
        { 
            id: 0,
            link: 'https://portal-neon.vercel.app',
            name: 'Portal',
            images: {
                alt: 'Portal',
                src: [
                    '/backgrounds/myworks/project-1.webp',
                    '/backgrounds/myworks/project-1.jpg',
                ]
            }
        },
        { 
            id: 1,
            link: 'https://35-importing-and-optimizing-the-scene.vercel.app',
            name: 'Room',
            images: {
                alt: 'Room',
                src: [
                    '/backgrounds/myworks/project-2.webp',
                    '/backgrounds/myworks/project-2.jpg',
                ]
            }
        },
        { 
            id: 2,
            link: 'https://bloob.vercel.app',
            name: 'Bloob',
            images: {
                alt: 'Bloob',
                src: [
                    '/backgrounds/myworks/project-3.webp',
                    '/backgrounds/myworks/project-3.jpg',
                ]
            }
        },
        { 
            id: 3,
            link: 'https://parfum-amber.vercel.app',
            name: 'Parfum',
            images: {
                alt: 'Parfum',
                src: [
                    '/backgrounds/myworks/project-4.webp',
                    '/backgrounds/myworks/project-4.jpg',
                ]
            }
        },
    ], [])
    const [animation, setAnimation] = useState( () => null)
    const [ctx, setCtx] = useState( gsap.context(() => {}) )
    const q = gsap.utils.selector(works)

    useLayoutEffect( () => {
        gsap.config({
            force3D: false
        })
        ctx.add('scroller', () => {
            const scroller = worksScroller.current
            const scrollDistance = 100 * (myWorks.length - 1)
            
            
            const arrowAnimation = gsap.to( q('.works__direction'), { paused: true, x: '-20%', opacity: 0 })
            const scrollTween = gsap.to(scroller, { 
                xPercent: -scrollDistance,
                ease: "none",
                scrollTrigger: {
                    scroller: works.current,
                    trigger: q('.works__wrap'),
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress * 10
                        arrowAnimation.progress( progress )
                    },
                    snap: {
                        snapTo: 1 / (myWorks.length - 1),
                        directional: false,
                        duration: 0.2,
                        inertia: true,
                        ease: 'power2',
                        // onComplete: animateWorkTitle
                    }
                }
            })
            
            ScrollTrigger.sort()
            ScrollTrigger.refresh()

            setAnimation(() => scrollTween)
        })
        ctx.add('inAnimation', () => {
            const tl = gsap.timeline({
                onStart: ctx.scroller
            })
            tl.to(q('.work__image'), {
                scale: 1, 
                y: '0', 
                opacity: 1,
                duration: 1.2,
            })
            // tl.fromTo(q('.works__titles'), {
            //     scale: 0.4, 
            //     y: 60, 
            //     opacity: 0
            // }, {
            //     scale: 1,
            //     y: 0,
            //     opacity: 1,
            //     duration: 0.5,
            //     ease: 'power2'
            // }, 1)
            tl.fromTo(q('.works__arrow'), {x: -20, opacity: 0}, {
                x: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power1'
            }, 0.7)

            return tl
        })
        ctx.add(() => {
            gsap.set( q('.works__wrap'), { height: '250%' })
            gsap.set(q('.work__image'), { scale: 0.5, y: '180%', opacity: 0 })
        })
        
        // Cleanup
        return () => {
            ctx.revert()
        }
    }, [])
    useLayoutEffect(() => {
        addAnimation( ctx.inAnimation() )
    }, [ addAnimation ])

    return <>
        <div ref={ works } className="works">
            <div className="works__wrap">
                <div className="works__sticky">
                    <div className="works__direction">
                        <div className="works__arrow">
                            <svg viewBox="0 0 78.6 554.7">
                                <path className="arrow" d="M6,0v554.6c0,0,3.5-126.6,72.6-126.6"/>
                            </svg>
                        </div>
                    </div>
                    {/* <div className="works__titles">
                        { myWorks.map( work => {
                            const key = Date.now() + work.id
                            
                            return (
                                <div className="work__info" key={ key }>
                                    <h2 className="work__name"><span>{ work.name }</span></h2>
                                </div>
                            )
                        }) }
                    </div> */}
                    <div className="works__picture">
                        <div ref={ worksScroller } className="works__scroller">
                            { myWorks.map( (props, i) => {
                                return (
                                    <ProjectBlock key={ props.id } id={ i } animation={ animation } {...props} />
                                )
                            }) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}