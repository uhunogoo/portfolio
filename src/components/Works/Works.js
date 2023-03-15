import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MenuContext } from '../Providers/MenuProvider';

gsap.registerPlugin( ScrollTrigger );

import styles from '../../assets/works.module.css';
import Image from 'next/image';

function Works() {
  const scroller = React.useRef();
  const worksWrap = React.useRef();
  const [ progress, setProgress ] = React.useState( 0 );
  const [ openedMenu, setOpenedMenu ] = React.useState( false );
  const { menu } = React.useContext( MenuContext );

  const myWorks = React.useMemo(() => [
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
  ], []);
  
  React.useEffect(() => {
    if (menu === 'default') return;
    setOpenedMenu( menu );
  }, [ menu ]);

  return <>
    { openedMenu === 'works' &&
      <div ref={ scroller } className={styles.works}>
        <div ref={worksWrap} className={styles.wroks__wrap}>
          { myWorks.map( (props, i) => {
            return (
              <WorkBlock key={ props.id } scroller={ scroller } id={ i } {...props} />
            )
          }) }
        </div>
        <input
          type="range"
          className={styles.progress}
          min={0}
          max={100}
          value={progress}
          onChange={event => {
            setProgress(event.target.value);
          }}
        />
      </div>
    }
  </>;
}

function WorkBlock({ id, images, scroller, ...props }) {
  const image = React.useRef();
  const wrokBlock = React.useRef();
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      // gsap.set(scroller.current, { transformPerspective: "2000px" });
      gsap.set(image.current, { 
        transformOrigin: '100% 50%',
        transformPerspective: 2400 
      });

      const animation = gsap.timeline({ defaults: { ease: 'none' } });
      // animation.fromTo(image.current, { 
      //   rotationX: '-15deg',
      //   rotationZ: '-15deg',
      // }, {
      //   rotationX: '15deg',
      //   rotationZ: '15deg',
      // });
      animation.to(image.current, {
        keyframes: {
          '0%': { 
            rotationX: '45deg',
            rotationY: '-15deg',
            rotationZ: '-15deg',
            scale: 0.8, 
            xPercent: 10, 
          },
          '50%': { 
            rotationX: '0deg',
            rotationY: '0deg', 
            scale: 1, 
            xPercent: 0,
          },
          '100%': { 
            rotationX: '45deg',
            rotationY: '-15deg',
            rotationZ: '15deg',
            scale: 0.8, 
            xPercent: 10, 
          },
        }
      }, 0);
      ScrollTrigger.create({
        scroller: scroller.current,
        trigger: wrokBlock.current,
        start: "-20% bottom",
        end: '120% top',
        // markers: true,
        animation: animation,
        scrub: 0.8
      });
    });

    return () => {
      ctx.revert();
    }
  //   gsap.set(wrokBlock.current, { xPercent: 100 * id });
  }, []);
  return (
    <div ref={ wrokBlock } className={styles.work }>
      <a className={`${styles.work__link} ${styles.work__image}`} href={ props.link } target="_blank" rel="nofollow noopener">
        <Image
          ref={image}
          src={images.src[0]}
          alt={ images.alt }
          fill={ true }
        />
        {/* <picture>
          <source srcSet={ images.src[0] } />
          <img width="1323" height="785" src={ images.src[1] } alt={ images.alt } />
        </picture> */}
      </a>
    </div>
  );
}

export default React.memo( Works );
