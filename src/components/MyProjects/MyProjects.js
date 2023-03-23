import React from 'react';
import { gsap } from 'gsap';
import { MenuContext } from '../Providers/MenuProvider';

import styles from '../../assets/works.module.css';

import ContentScroller from '../ContentScroller/ContentScroller';
import ProjectBlock from './ProjectBlock';

function MyProjects() {
  const scroller = React.useRef();
  const worksWrap = React.useRef();

  const [ tl, setTl ] = React.useState( null );
  const [ played, setPlayed ] = React.useState( false );

  const { menu } = React.useContext( MenuContext );

  const myWorks = React.useMemo(() => [
    { 
      id: Math.random(),
      link: 'https://portal-neon.vercel.app',
      name: 'Portal',
      images: {
        alt: 'Portal',
        src: '/backgrounds/myworks/project-1.jpg'
      }
    },
    { 
      id: Math.random(),
      link: 'https://35-importing-and-optimizing-the-scene.vercel.app',
      name: 'Room',
      images: {
        alt: 'Room',
        src: '/backgrounds/myworks/project-2.jpg'
      }
    },
    { 
      id: Math.random(),
      link: 'https://bloob.vercel.app',
      name: 'Bloob',
      images: {
        alt: 'Bloob',
        src: '/backgrounds/myworks/project-3.jpg'
      }
    },
    { 
      id: Math.random(),
      link: 'https://parfum-amber.vercel.app',
      name: 'Parfum',
      images: {
        alt: 'Parfum',
        src: '/backgrounds/myworks/project-4.jpg'
      }
    },
  ], []);
  
  function animationEnd() {
    gsap.delayedCall(1, () => {
      setPlayed( true );
    });
  }

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        paused: true,
        onComplete: animationEnd
      });
      tl.from('.gsapProject', {
        yPercent: 160,
        opacity: 0,
        scale: 0.1,
        duration: 0.8,
        ease: 'power1.out',
        stagger: {
          each: 0.06,
        } 
      });
      tl.from('.gsapTitle span', {
        yPercent: 160,
        opacity: 0,
      }, 0.35);
      setTl( tl );
    });

    return () => {
      ctx.revert();
    }
  }, []);
  React.useLayoutEffect(() => {
    if ( !tl ) return;
    const reversed = menu === 'default';
    const delay = menu !== 'works' ? 0 : 0.4;

    gsap.delayedCall(delay, () => {
      tl.play().reversed( reversed );
    });
  }, [ menu, tl ]);


  return <>
    <ContentScroller played={ played }>
      <div ref={ scroller } className={ styles.works }>
        <h2 className={`gsapTitle ${styles.content__title}`}><span>My works:</span></h2>
        <div ref={worksWrap} className={ styles.wroks__wrap }>
          { myWorks.map( (props, i) => {
            return (
              <ProjectBlock
                key={ props.id }
                id={ i }
                className="gsapProject"
                {...props} 
              />
            )
          }) }
        </div>
      </div>
    </ContentScroller>
  </>;
}

export default React.memo( MyProjects );
