import gsap from 'gsap';
import React from 'react';
import Image from 'next/image';

import { EnterContext } from '../EnterProvider/EnterProvider';
import { LoadingProgressContext } from '../LoadingProvider/LoadingProvider';

// console.log( useResources )
import styles from '../../assets/preload.module.css';
import Progressbar from './Progressbar';

function Preload() {
  const preloadBlock = React.useRef();
  const [ showPreloader, setShowPreloader ] = React.useState( true );
  const { loadingProgress } = React.useContext( LoadingProgressContext );
  const { enterStatus, setEnterStatus } = React.useContext(EnterContext);
  
  React.useEffect(() => {
    if (loadingProgress !== 100) return;
    const ctx = gsap.context(() => {
      gsap.to(preloadBlock.current, {
        background: 'transparent',
        ease: 'power2',
        duration: 2,
        delay: 0.2
      });
    });

    return () => {
      ctx.revert();
    }
  }, [loadingProgress]);

  React.useEffect(() => {
    if (!enterStatus) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector( preloadBlock.current );
      const tl = gsap.timeline({
        defaults: {
          overwrite: true,
          immediateRender: true,
          duration: 1,
          ease: 'power1.out',
        },
        onComplete: () => setShowPreloader( false )
      });
      tl.to(q('.gsap_line'), {
        transformOrigin: 'center center',
        yPercent: gsap.utils.wrap([100, -100]),
        ease: 'power2'
      }, 0);
      tl.to(q('.gsap_title_text span'), {
        transformOrigin: 'center center',
        opacity: 0,
        yPercent: gsap.utils.wrap([-100,100]),
        ease: 'power4',
        duration: 0.6
      }, 0);
      tl.to(q('.gsap_title'), {
        opacity: 0,
        ease: 'power3'
      }, '<+=30%');
      tl.to(q('.gsap_decor'), {
        rotate: '-180deg',
        scale: 2,
        opacity: 0,
        duration: 1.3,
        ease: 'power1.inOut'
      }, '<');
    });

    return () => {
      ctx.revert();
    }
  }, [enterStatus, styles])

  return (
    <>
      { showPreloader && 
        <div ref={ preloadBlock } className={styles.preload}>
          <div className={styles.preload__content}>
            <div className={`gsap_decor ${ styles.preload__decor }`}>
              <div className={styles.preload__disc}>
                <Image
                  src="/backgrounds/grece.svg"
                  alt="grece image"
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </div>
            <h1 className={`gsap_title ${ styles.preload__title }`}>
              <span
                className={`gsap_line ${styles.preload__line} ${styles.preload__line_top}`}
              ></span>
              <div className={`gsap_title_text ${ styles.preload__titleContainer }`}>
                <span>Yurii Scherbachenko</span>
                <span>Frontend developer</span>
              </div>
              <span
                className={`gsap_line ${styles.preload__line} ${styles.preload__line_bottom}`}
              ></span>
            </h1>
          </div>
          <Progressbar loadingProgress={ loadingProgress } />
          <EnterButton enterStatus={ enterStatus } setEnterStatus={ setEnterStatus } />
        </div> 
      }
    </>
  );
}

function EnterButton({ enterStatus, setEnterStatus }) {
  const enterButton = React.useRef();
  const ctx = React.useMemo( () => ( 
    gsap.context(() => {})
  ), []);
  const { loadingProgress } = React.useContext( LoadingProgressContext );
  React.useEffect(() => {
    ctx.add('buttonOut', () => {
      const animation = gsap.to(enterButton.current, {
        opacity: 0,
        scale: 0.3,
        duration: 0.4,
        paused: true,
        immediateRender: true,
        onComplete: () => setEnterStatus(!enterStatus)
      });
      return animation;
    });
    ctx.add('textGradient', () => {
      const q = gsap.utils.selector(enterButton.current);
      const animation = gsap.to(q('span'), {
        keyframes: {
          '50%': { color: '#F3B754', ease: 'power1.out' },
          '100%': { color: '#121F2F', ease: 'power1.in' },
        },
        immediateRender: true,
        overwrite: true,
        duration: 0.4,
        stagger: 0.05,
        paused: true,
      });
      return animation;
    });

    return () => {
      ctx.revert();
    };
  }, []);

  React.useEffect(() => {
    if (loadingProgress !== 100) return;
    ctx.add(() => {
      gsap.fromTo(  enterButton.current, {
        autoAlpha: 0,
        y: 40,
        scale: 2,
      }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        delay: 1,
        onComplete: () => ctx.textGradient().play()
      });
    });
  }, [ loadingProgress ]);

  function hoverAnimation() {
    if (!ctx) return;
    ctx.textGradient().restart();
  }
  function clickAnimation() {
    if (!ctx) return;
    ctx.buttonOut().play();
  }
  return (
    <button
      ref={enterButton}
      className={styles.preload__enter}
      title="run experience"
      type="button"
      onMouseEnter={ hoverAnimation }
      onClick={ clickAnimation }
    >
      <span>e</span>
      <span>n</span>
      <span>t</span>
      <span>e</span>
      <span>r</span>
    </button>
  );
}

export default React.memo(Preload);
