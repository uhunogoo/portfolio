import { gsap } from 'gsap';
import Image from 'next/image';
import React from 'react';
import styles from '../../assets/aboutme.module.css';
import ContentScroller from '../ContentScroller/ContentScroller';
import { MenuContext } from '../Providers/MenuProvider';

function AboutMe() {
  const [ tl, setTl ] = React.useState( null );
  const [ played, setPlayed ] = React.useState( false );
  const { menu } = React.useContext( MenuContext );
  
  function animationEnd() {
    gsap.delayedCall(1, () => {
      setPlayed( true );
    });
  }

  React.useLayoutEffect( () => {
    const ctx = gsap.context( () => {
      gsap.set( '.gsapText span', { y: 100 });
      gsap.set( '.gsapListIcon', { opacity: 0, x: '-1.6rem', scale: 0.1 });
      gsap.set( '.gsapLinks img', { opacity: 0, scale: 0.1 });

		  const tl = gsap.timeline({ 
        paused: true, 
        onComplete: animationEnd,
        defaults: { immediateRender: true } 
      });
			tl.from('.gsapImage', {
				scale: .6,
				xPercent: -20, 
				yPercent: -110, 
				rotate: '-10deg',
				duration: 1,
				ease: 'power2'
			}, 0);
			tl.from('.gsapTitle span', {
				yPercent: 100,
				stagger: {
					each: 0.1,
					ease: 'power2'
				}
			}, 0);
			tl.to('.gsapText span', {
				y: 0,
				stagger: {
					each: 0.07,
					ease: 'power1'
				}
			}, 0);
			tl.to('.gsapListIcon', {
				opacity: 1,
				scale: 1,
				stagger: {
					amount: 0.4,
					ease: 'power3.in'
				}
			}, '<+=50%');
			tl.to('.gsapLinks img', {
				opacity: 1,
				scale: 1,
				stagger: 0.1,
				ease: 'power3.in'
			}, '<-=50%');
			tl.from('.gsapDecor', { 
        scale: 1.6, 
        rotate: '90deg', 
        x: '100%', 
        y: '-60%',
        opacity: 0,
				duration: 0.6
			}, '<');

      setTl( tl );
		});

		return () => ctx.revert()
  }, []);
  
  React.useEffect(() => {
    if (!tl) return;
    const reversed = menu !== 'about' ? true : false;
    const timescale = menu !== 'about' ? 1.4 : 1;
    const delay = menu !== 'about' ? 0 : 0.4;

    gsap.delayedCall(delay, () => {
      tl.play().timeScale( timescale ).reversed( reversed );
    });
  }, [tl, menu]);

  return <>
    <ContentScroller played={ played }>
      <div className={ styles.content }>
        <div className={ styles.content__block }>
          <div className={ styles.content__text }>
            <h2 className={`gsapTitle ${styles.content__title}`}><span>About Me</span></h2>
            <p className={`gsapText ${styles.animateText}`}>
              <span>
                Hi, I'm Yurii Scherbachenko, a self-taught frontend developer from Odessa, Ukraine. I'm specialized in creative coding for interactive projects like apps and websites using web development technologies like WebGL, GLSL and&nbsp;JavaScript.
              </span>
            </p>
          </div>
          <figure className={styles.content__image}>
            <div className={styles.content__imageWrap}>
              <Image 
                className="gsapImage"
                src='/backgrounds/image.jpg'
                width="570" height="856"
                quality={100}
                title="Me"
                alt="Yurii Scherbachenko"
                placeholder="empty"
              />
            </div>
            <figcaption className={`gsapLinks ${styles.content__links}`}>
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
          <div className={`${styles.content__text} ${styles.content__text_1}`}>
            <h2 className={`gsapTitle ${styles.content__title}`}>
              <span>My skills</span>
            </h2>
            <p className={`gsapText ${styles.animateText}`}>
              <span>
                html, sass/scss, css, JavaScript(ES6+), Three.js, shaders, GSAP, blender, figma, adobe photoshop, affinity design, vite, webpack, parcel,&nbsp;git
              </span>
            </p>
            <h2 className={`gsapTitle ${styles.content__title}`}>
              <span>Learning & Interests</span>
            </h2>
            <p className={`gsapText ${styles.animateText}`}>
              <span>
                Three.js, shaders, GSAP, blender, 3D, React
              </span>
            </p>
            <h2 className={`gsapTitle ${styles.content__title}`}>
              <span>Courses</span>
            </h2>
            <ul>
              <li>
                <span className={`gsapListIcon ${styles.icon}`}></span>
                <p className={`gsapText ${styles.animateText}`}>
                  <span>
                    Three.js journey
                  </span>
                </p>
              </li>
              <li>
                <span className={`gsapListIcon ${styles.icon}`}></span>
                <p className={`gsapText ${styles.animateText}`}>
                  <span>
                    creativeCodingClub
                  </span>
                </p>
              </li>
              <li>
                <span className={`gsapListIcon ${styles.icon}`}></span>
                <p className={`gsapText ${styles.animateText}`}>
                  <span>
                    FreeCodeCamp
                  </span>
                </p>
              </li>
              <li>
                <span className={`gsapListIcon ${styles.icon}`}></span>
                <p className={`gsapText ${styles.animateText}`}>
                  <span>
                    TheBookOfShaders
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className={`gsapDecor ${styles.decor}`}></div>
      </div>
    </ContentScroller>
  </>;
}

export default React.memo( AboutMe );
