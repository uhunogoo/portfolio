import React from 'react';
import { gsap } from 'gsap';
import styles from '../../assets/modal.module.css';


function CloseButton({clickAnimation, clearAnimation, ...props}) {
  const closeButton = React.useRef();
  const [ ctx ] = React.useState( gsap.context(() => {}) );
  const [ tl, setTl ] = React.useState( gsap.timeline({ paused: true }) );

  React.useLayoutEffect(() => {
    ctx.add('inAnimation', () => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl.to( closeButton.current, {
        opacity: 1,
        scale: 1
      });
      tl.to('.gsapGroup', { 
          rotate: gsap.utils.wrap([0, 0]),
          duration: 0.4,
          ease: 'power1'
      });
      return tl;
    });
    ctx.add('buttonOut', () => {
      const animation = gsap.to( closeButton.current, {
          opacity: 0,
          scale: 0,
          overwrite: true,
          duration: 1,
          onStart: clickAnimation,
          onComplete: clearAnimation
      });
      return animation;
    } );
    ctx.add('hoverAnimation', () => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.gsapGroup', {
        rotate: gsap.utils.wrap([0, 0]), 
      }, { 
          rotate: gsap.utils.wrap([-45, 45]),
          duration: 0.4,
          ease: 'power1'
      });
      return tl;
    });

    ctx.add(() => {
      gsap.set('.gsapGroup', { 
        rotate: gsap.utils.wrap([-45, 45]), 
        transformOrigin: '50% 50%' 
      })
      gsap.set(closeButton.current, { scale: 0, opacity: 0 });

      ctx.inAnimation();
      setTl( ctx.hoverAnimation() );
    });

    return () => {
      ctx.revert();
    }
  }, []);

  return (
    <button 
      ref={ closeButton } 
      {...props} 
      className={ styles.close_btn } 
      title="close" 
      type="button" 
      onMouseEnter={ () => tl.play() }
      onMouseLeave={ () => tl.play().reversed(true) }
      onClick={ () => {
        ctx.buttonOut();
      } }
    >
      <svg className={ styles.svg_icon } viewBox="0 0 800 800">
        <g className="gsapGroup" id="first">
          <line className={ styles.st0 } x2="525" y2="525" x1="759.2" y1="759.2"/>
          <line className={ styles.st0 } x1="40.8" y1="40.8" x2="275" y2="275"/>
        </g>
        <rect className={ styles.square } x="332.1" y="332.1" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -165.6854 400)" width="135.8" height="135.8"/>
        <g className="gsapGroup" id="second">
          <line className={ styles.st0 } x2="525" y2="275" x1="759.2" y1="40.8"/>
          <line className={ styles.st0 } x1="40.8" y1="759.2" x2="275" y2="525"/>
        </g>
      </svg>
    </button>
  );
}

export default React.memo( CloseButton );