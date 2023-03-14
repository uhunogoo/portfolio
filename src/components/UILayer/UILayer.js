import React from 'react';
import { gsap } from 'gsap';
import { EnterContext } from '../Providers/EnterProvider';

import styles from '../../assets/ui-layer.module.css';
import { PreloadedContext } from '../Providers/PreloadedContentProvider';
import { MenuContext } from '../Providers/MenuProvider';
import { useMousePosition } from '../../lib/useMouse';
import { ModalContext } from '../Providers/ModalProvider';

function UILayer() {
  const compass = React.useRef();
  const menuBlock = React.useRef();
  const [ playCount, setPlayCount ] = React.useState( 0 );
  const tl = React.useMemo( () => gsap.timeline({ paused: true }), []);
  const ctx = React.useMemo( () => gsap.context(() => {}), [] );

  const { enterStatus } = React.useContext(EnterContext);
  const { menu, setMenu } = React.useContext( MenuContext );
  const { setModalStatus } = React.useContext( ModalContext );
  const { preloadedContent } = React.useContext( PreloadedContext );

  const buttons = React.useMemo( () => [
    {
      class: 'menu__item_about',
      src: '/backgrounds/about.svg',
      text: 'About me',
      title: 'about me',
      name: 'about',
    },
    {
      class: 'menu__item_works',
      src: '/backgrounds/works.svg',
      text: 'Works',
      title: 'my works',
      name: 'works',
    },
  ], []);

  React.useLayoutEffect(() => {
    if ( !enterStatus ) return;
    ctx.add('introAnimation', () => {
      const tl = gsap.timeline({
        delay: 0.8,

      });
      tl.from(menuBlock.current,{ opacity: 0, 
        scale: 1.5, 
        x: -100, 
        y: 100, 
        rotate: '-90deg',
        ease: 'power2',
        duration: 1
      }, 0);
      tl.from(compass.current, {
          y: -50, 
          opacity: 0,
          ease: 'power1',
          duration: 0.75
      }, 0);
      tl.from('.gsapButton', {
        scale: 0,
        opacity: 0,
        stagger: {
          each: 0.1,
          from: "end",
          ease: "power1.inOut"
        },
      }, 0.4);
      tl.from('.gsapButton span', {
          opacity: 0, 
          y: 30, 
          scale: 0.6,
          ease: 'power1',
          overwrite: true,
          stagger: {
            // amount: 0.2,
            each: 0.1,
            from: "end",
            ease: "power1.inOut"
          },
      }, 0.4);

      return tl.play();
    });

    ctx.add(() => {
      gsap.config({
        autoSleep: 60,
        force3D: false,
        units: { rotation: "deg" }
      });

      tl.add( ctx.introAnimation() );
    });

    return () => {
      ctx.revert();
    }
  }, [ enterStatus ]);

  React.useLayoutEffect(() => {
    if ( !enterStatus ) return;
    const isMenuDefault = menu === 'default';
    const isFirstPlay = playCount === 0;
    const timescale = isFirstPlay ? 1 : 2; 
    const delay = isFirstPlay ? 0
                  : isMenuDefault 
                  ? 0.4 : 0;

    gsap.delayedCall(delay, () => {
      tl.play().timeScale( timescale ).reversed( !isMenuDefault );
    })
    
    
    setPlayCount( playCount + 1 );
  }, [ enterStatus, menu ])

  function menuHandler( name ) {
    setModalStatus(true);
    setMenu( name );
  }

  return (
    <>
      { enterStatus && (
        <div className={styles.uiLayer}>
          <div ref={ compass } className={ styles.compass }>
            <img width="620" height="37" src="/backgrounds/compass.svg" alt="compass" />
            <AnimatedDots>
              <img width="434" height="6" src="/backgrounds/compass-dots.png" alt="dots" />
            </AnimatedDots>
          </div>
          <nav ref={ menuBlock } className={ styles.menu }>
            {buttons.map((button, i) => {
              return (
                <MenuButton
                  key={ i }
                  className={'gsapButton'}
                  clickAction={ 
                    () => menuHandler( button.name ) 
                  }
                  buttonData={ button }
                  audio={ preloadedContent?.find(el => el.name === "open") }
                />
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

function AnimatedDots({ children }) {
  const dotsBlock = React.useRef();
  const mouse = useMousePosition();
  const [ctx] = React.useState( gsap.context(() => {}) );

  React.useLayoutEffect(() => {
    ctx.add('moveX', ( x ) => {
      const moveX = gsap.quickTo(dotsBlock.current, 'x', {
        ease: 'power1',
        duration: 0.7,
      });
      
      return moveX( x );
    })
    ctx.add(() => {
      gsap.set(dotsBlock.current, { xPercent: -50, yPercent: -50 });
    });

    return () => {
      ctx.revert();
    }
  }, []);
  React.useLayoutEffect(() => {
    ctx.moveX( - mouse.x * 30 )
  }, [mouse]);

  return (
    <div ref={ dotsBlock } className={styles.compass__dots }>
      { children }
    </div>
  );
}

function MenuButton({ clickAction, buttonData, audio, className = '' }) {
  const finalClassName = `${styles.menu__item} ${styles[buttonData.class]} ${ className }`;
  return (
    <button
      className={ finalClassName }
      title={buttonData.title}
      type="button"
      onClick={() => {
        clickAction();
        audio.item.play();
      }}
    >
      <div className={ styles.menu__icon }>
        <img
          width="50"
          height="50"
          src={buttonData.src}
          alt={buttonData.text}
        />
      </div>
      <span>{buttonData.text}</span>
    </button>
  );
}

export default React.memo(UILayer);
