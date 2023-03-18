import Image from 'next/image';
import React from 'react';
import { gsap } from 'gsap';

import styles from '../../assets/works.module.css';

function ProjectBlock({ id, images, name, className, ...props }) {
  const projectBlockClass = `${className} ${styles.work}`
  const letters = React.useMemo(() => name.split(''), [ name ]);
  const projectBlock = React.useRef();
  const image = React.useRef();
  
  const [ tl, setTl ] = React.useState( null );

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(projectBlock.current, {
        transformOrigin: '50% 50%',
        transformPerspective: 2400 
      });
      const tl = gsap.timeline({ paused: true })
      tl.from('.gsapLetter', {
        x: 10,
        opacity: 0,
        stagger: {
          amount: 0.2,
          each: 0.05,
        }
      }, 0);

      setTl( tl );

    }, projectBlock.current);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={ projectBlock } 
      className={ projectBlockClass }
      onMouseEnter={ () => tl.play() }
      onMouseLeave={ () => tl.play().timeScale(1.25).reversed(true) }
    >
      <h3 className={styles.work__title }>
        { letters?.map((letter, i) =>(
          <span key={ i } className='gsapLetter'>{ letter }</span>
        )) }
      </h3>
      <a 
        ref={image} 
        className={`${styles.work__link} ${styles.work__image}`} 
        rel="nofollow noopener"
        href={ props.link } 
        target="_blank"
      >
        <Image
          src={ images.src }
          alt={ images.alt }
          quality={100}
          width="1200" height="400"
          sizes="(max-width: 570px) 570px,
                 (max-width: 768px) 850px,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      </a>
    </div>
  );
}

export default ProjectBlock;