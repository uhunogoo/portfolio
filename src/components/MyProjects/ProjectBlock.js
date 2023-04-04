import Image from 'next/image';
import React from 'react';
import { gsap } from 'gsap';

import styles from '../../assets/works.module.css';

import { useMobileDetection } from '../../lib/useMobileDetection';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

function ProjectBlock({ id, images, name, className, ...props }) {
  const mobileStatus = useMobileDetection();
  const BlockType = mobileStatus ? MobileProjectBlock : DesctopProjectBlock;

  const letters = React.useMemo(() => name.split(''), [ name ]);

  const projectBlockClass = `${className} ${styles.work}`;

  return (
    <BlockType 
      className={ projectBlockClass }
    >
      <h3 className={styles.work__title }>
        { letters?.map((letter, i) =>(
          <span key={ i } className='gsapLetter'>{ letter }</span>
        )) }
      </h3>
      <a
        className={`${styles.work__link} ${styles.work__image}`} 
        rel="nofollow noopener"
        href={ props.link } 
        target="_blank"
      >
        <Image
          src={ images.src }
          alt={ images.alt }
          quality={100}
          placeholder="empty"
          width="1200" height="400"
          sizes="(max-width: 570px) 570px,
                (max-width: 768px) 850px,
                (max-width: 1200px) 50vw,
                33vw"
        />
      </a>
    </BlockType>
  );
}

function MobileProjectBlock({ children, className }) {
  const block = React.useRef();
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from('.gsapLetter', {
        x: 10,
        opacity: 0,
        stagger: {
          amount: 0.2,
          each: 0.05,
        }
      });
      const scroller = document.querySelector('.gsapScroller');
      ScrollTrigger.create({
        animation: tl,
        start:"50% bottom",
        scroller: scroller,
        trigger: block.current,
        toggleActions: 'restart none none reverse'
      });

      gsap.delayedCall(1.4, () => {
        ScrollTrigger.refresh();
      });
    }, block.current);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={block}
      className={ className }
    >
      { children }
    </div>
  );
}
function DesctopProjectBlock({ children, className }) {
  const [ tl, setTl ] = React.useState(null);
  const block = React.useRef();
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.from('.gsapLetter', {
        x: 10,
        opacity: 0,
        stagger: {
          amount: 0.2,
          each: 0.05,
        }
      });

      setTl( tl );
    }, block.current);

    return () => ctx.revert();
  }, []);

  const handleHover = React.useCallback((reversed) => {
    if(!tl) return;
    const timescale = reversed ? 1.25 : 1;
    tl.play().timeScale( timescale ).reversed( reversed );
  }, [ tl ]);
  
  return (
    <div
      ref={block}
      className={ className }
      onMouseEnter={ () => handleHover( false ) }
      onMouseLeave={ () => handleHover( true ) }
    >
      { children }
    </div>
  );
}


export default ProjectBlock;