import '../assets/AboutMe.css'

import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

export default function AboutMe({ addAnimation }) {
    const aboutMe = useRef()
    const myPhoto = useRef()

    const q = gsap.utils.selector(aboutMe)
    useLayoutEffect( () => {
		const ctx = gsap.context( () => {
			gsap.set( q('.animate-text span'), { opacity: 0, y: 100 })
			gsap.set( q('.content__text span.icon'), { opacity: 0, x: '-1.6rem', scale: 0.1 })
			gsap.set( q('.content__links img'), { opacity: 0, scale: 0.1 })
			gsap.set( q('.content .decor'), { opacity: 0, scale: 1.6, rotate: '90deg', x: '100%', y: '-60%' })
		})

		return () => ctx.revert()
    }, [])
	useLayoutEffect( () => {
		const ctx = gsap.context(() => {
	
			const tl = gsap.timeline({ paused: true, defaults: { immediateRender: true } }) 
			tl.from(myPhoto.current, {
				scale: .6,
				xPercent: -20, 
				yPercent: -110, 
				rotate: '-10deg',
				duration: 1,
				ease: 'power2'
			}, 0)
			tl.from(q('.content__title span'), {
				yPercent: 100,
				stagger: {
					each: 0.1,
					ease: 'power2'
				}
			}, 0)
			tl.to(q('.animate-text span'), {
				opacity: 1,
				y: 0,
				stagger: {
					each: 0.07,
					ease: 'power1'
				}
			}, 0)
			tl.to(q('.content__text span.icon'), {
				opacity: 1,
				scale: 1,
				stagger: {
					amount: 0.4,
					ease: 'power3.in'
				}
			}, '<+=50%')
			tl.to(q('.content__links img'), {
				opacity: 1,
				scale: 1,
				stagger: 0.1,
				ease: 'power3.in'
			}, '<-=50%')
			tl.to(q('.content .decor'), { 
				opacity: 0.025, 
				scale: 1, 
				rotate: '0deg',
				x: '50%',
				duration: 1
			}, 0.3)

			addAnimation( tl.play() )
		})

		return () => ctx.revert()
    }, [ addAnimation ])

    return <>
		<div ref={ aboutMe } className="content">
			<div className="content__block">
				<div className="content__text">
					<h2 className="content__title"><span>About Me</span></h2>
					<p className="animate-text">
						<span>
							Hi, I'm Yurii Scherbachenko, a self-taught frontend developer from Odessa, Ukraine. I'm specialized in creative coding for interactive projects like apps and websites using web development technologies like WebGL, GLSL and&nbsp;JavaScript.
						</span>
					</p>
				</div>
				<figure className="content__image">
					<picture className="myPhoto">
						<source srcSet="/backgrounds/image.webp" />
						<img ref={ myPhoto } loading="lazy" width="570" height="856" src="/backgrounds/image.jpg" alt="Yurii" title="Me" />
					</picture>
					<figcaption className="content__links">
						<a href="#" role="link" target="_blank" real="nofollow noopener">
							<img loading="lazy" src="/backgrounds/icon-1.svg" width="20" height="20" alt="linkedin" />
						</a>
						<a href="#" role="link" target="_blank" real="nofollow noopener">
							<img loading="lazy" src="/backgrounds/icon-2.svg" width="20" height="20" alt="twitter" />
						</a>
						<a href="#" role="link" target="_blank" real="nofollow noopener">
							<img loading="lazy" src="/backgrounds/icon-3.svg" width="20" height="20" alt="github" />
						</a>
					</figcaption>
				</figure>
				<div className="content__text content__text_1">
					<h2 className="content__title">
						<span>My skills</span>
					</h2>
					<p className="animate-text">
						<span>
							html, sass/scss, css, JavaScript(ES6+), Three.js, shaders, GSAP, blender, figma, adobe photoshop, affinity design, vite, webpack, parcel,&nbsp;git
						</span>
					</p>
					<h2 className="content__title">
						<span>Learning & Interests</span>
					</h2>
					<p className="animate-text">
						<span>
							Three.js, shaders, GSAP, blender, 3D, React
						</span>
					</p>
					<h2 className="content__title">
						<span>Courses</span>
					</h2>
					<ul>
						<li>
							<span className="icon"></span>
							<p className="animate-text">
								<span>
									Three.js journey
								</span>
							</p>
						</li>
						<li>
							<span className="icon"></span>
							<p className="animate-text">
								<span>
									creativeCodingClub
								</span>
							</p>
						</li>
						<li>
							<span className="icon"></span>
							<p className="animate-text">
								<span>
									FreeCodeCamp
								</span>
							</p>
						</li>
						<li>
							<span className="icon"></span>
							<p className="animate-text">
								<span>
									TheBookOfShaders
								</span>
							</p>
						</li>
					</ul>
				</div>
			</div>
			<div className="decor"></div>
		</div>
    </>
}