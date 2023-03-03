import React from 'react';
import Image from 'next/image';


import { EnterContext } from '../EnterProvider/EnterProvider';
// import { useResources } from '../../lib/useResources';

// console.log( useResources )
import styles from '../../assets/preload.module.css';
import Progressbar from './Progressbar';

function Preload() {
  const { enterStatus, setEnterStatus } = React.useContext(EnterContext);

  
  // useResources && useResources( setLoadingProgress );

  return (
    <>
      <div className={ styles.preload }>
        <div className={ styles.preload__content }>
          <div className={ styles.preload__decor }>
            <div className={ styles.preload__disc }>
              <Image 
                src="/backgrounds/grece.svg"
                alt="grece image"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
          <h1 className={ styles.preload__title }>
            <span className={
              `${styles.preload__line} ${ styles.preload__line_top }`
            }></span>
            <div className={ styles.preload__titleContainer }>
              <span>Yurii Scherbachenko</span>
              <span>Frontend developer</span>
            </div>
            <span className={
              `${styles.preload__line} ${ styles.preload__line_bottom }`
            }></span>
          </h1>
        </div>
        <Progressbar />
        <button
          className={ styles.preload__enter }
          title="enter"
          type="button"
          onClick={() => setEnterStatus(!enterStatus)}
        >
          <span>e</span>
          <span>n</span>
          <span>t</span>
          <span>e</span> 
          <span>r</span>
        </button>
      </div>
    </>
  );
}

export default React.memo(Preload);
