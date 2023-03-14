import React from 'react';
import { MenuContext } from '../Providers/MenuProvider';

import styles from '../../assets/works.module.css';

function Works() {
  const [ tl, setTl ] = React.useState( null );
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
      <div className={styles.works}>
        <div className={ styles.works__wrap }>
          <div className={ styles.works__sticky }>
            <div className={ styles.works__direction }>
              <div className={ styles.works__arrow }>
                <svg viewBox="0 0 78.6 554.7">
                  <path className={ styles.arrow } d="M6,0v554.6c0,0,3.5-126.6,72.6-126.6"/>
                </svg>
              </div>
            </div>
            <div className={styles.works__picture }>
              <div className={styles.works__scroller }>
                { myWorks.map( (props, i) => {
                  return (
                    <WorkBlock key={ props.id } id={ i } {...props} />
                  )
                }) }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </>;
}

function WorkBlock({ id, images, ...props }) {
  return (
    <div className={styles.work }>
      <a className={`${styles.work__link} ${styles.work__image}`} href={ props.link } target="_blank" rel="nofollow noopener">
        <picture>
          <source srcSet={ images.src[0] } />
          <img width="1323" height="785" src={ images.src[1] } alt={ images.alt } />
        </picture>
      </a>
    </div>
  );
}

export default React.memo( Works );
